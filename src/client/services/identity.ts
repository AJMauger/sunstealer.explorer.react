import axios, { AxiosResponse } from "axios";
import base64 from "base64-js";
import * as jwt from "jwt-decode";

import { _configuration, _logger } from "../index";


export enum eOIDCFLOW {
  eSIGNEDOUT = "0",
  eSIGNINGIN = "1",
  eSIGNEDIN = "2",
}

export class Identity {
  private interval: NodeJS.Timeout | undefined = undefined;

  public accessToken: string | null = sessionStorage.accessToken;
  public code: string | null = sessionStorage.code;
  public codeVerifier: string | null = sessionStorage.codeVerifier;
  public discovery: any;
  public headers: any = {};
  public identityToken: string | null = sessionStorage.identityToken;
  public redirect: string = encodeURIComponent(`${document.location.origin}${_configuration.configuration.ingress}/oidc`);
  public refreshToken: string | null = sessionStorage.refreshToken;
  public userInfo: any = JSON.parse(sessionStorage.userInfo || "{}");

  public constructor() {
    _logger.LogDebug(`identity: : code: ${this.code}`);
    _logger.LogDebug(`identity: : code_verifier: ${this.codeVerifier}`);
    _logger.LogDebug(`identity: : redirect: ${this.redirect}`);
  }

  // ajm: -----------------------------------------------------------------------------------------
  public AuthorizationCodeFlowPKCE = async (): Promise<void> => {
    if (!this.code) {
      if (!this.codeVerifier) {
        // ajm: offline_access => refresh tokens
        // ajm: openid => subject
        // ajm: profile => name
        // ajm: create code challemge/verifier
        const uri: string = `${this.discovery?.authorization_endpoint}?client_id=sunstealer_explorer&code_challenge=${this.CodeChallenge()}&code_challenge_method=S256&redirect_uri=${this.redirect}&response_type=code&scope=offline_access openid profile`;
        _logger.LogDebug(`identity: AuthorizationCodeFlowPKCE() code request: ${uri}`);
        window.location.assign(uri);
      } else if (!this.accessToken) {
        _logger.LogDebug(`identity: AuthorizationCodeFlowPKCE() code response: ${window.location.href}`);
        const url: URL = new URL(window.location.href);
        this.code = url.searchParams.get("code");
        if (this.code) {
          await this.GetToken();  // ajm: exchange code for tokens
          this.SetState(eOIDCFLOW.eSIGNEDIN);
        } else {
          _logger.LogError(`identity: AuthorizationCodeFlowPKCE() code: ${this.code}`);
          sessionStorage.codeVerifier=undefined;
          this.SetState(eOIDCFLOW.eSIGNEDOUT);
          this.codeVerifier=null;
        }
      }
    }
  }

  // ajm: -----------------------------------------------------------------------------------------
  public CodeChallenge = async (): Promise<string | undefined> => {
    try {

      const randomBuffer: Uint8Array = new Uint8Array(128);
      window.crypto.getRandomValues(randomBuffer);
      const charset: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const buffer: Array<string> = [];
      for (let i: number = 0; i < randomBuffer.byteLength; i++) {
        buffer.push(charset[randomBuffer[i] % charset.length]);
      }
      this.codeVerifier = buffer.join("");
      sessionStorage.setItem(`codeVerifier`, this.codeVerifier);
      const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(this.codeVerifier));
      const codeChallenge: string = base64.fromByteArray(new Uint8Array(hash)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      return codeChallenge;
    } catch (e) {
      _logger.LogException(e as any);
    }
    return undefined;
  }
  
  // ajm: -----------------------------------------------------------------------------------------
  public GetToken = async (): Promise<void> => {
    try {
      let data: string = "";
      if (this.refreshToken) {
        _logger.LogDebug("identity: GetToken() grant_type: refresh_token");
        data = `client_id=sunstealer_explorer&code_verifier=${this.codeVerifier}&grant_type=refresh_token&redirect_uri=${this.redirect}&refresh_token=${this.refreshToken}`;
      } else {
        _logger.LogDebug("identity: GetToken() grant_type: authorization_code");
        data = `client_id=sunstealer_explorer&client_secret=client_secret&code=${this.code}&code_verifier=${this.codeVerifier}&grant_type=authorization_code&redirect_uri=${this.redirect}`;
      }
      _logger.LogDebug(`identity: GetToken() uri: ${this.discovery?.token_endpoint} data: ${data}`);
      await axios.post(this.discovery?.token_endpoint, data).then(async (r: AxiosResponse) => {
        try {
          const reload: boolean = !this.accessToken; 
          _logger.LogInformation(`identity: GetToken() status: ${r.status} ${r.statusText} tokens: ${JSON.stringify(r.data)}`);
          this.accessToken = r.data.access_token;
          sessionStorage.accessToken=this.accessToken;
          this.identityToken = r.data.id_token;
          sessionStorage.identityToken=this.identityToken;
          this.refreshToken = r.data.refresh_token;
          sessionStorage.refreshToken=this.refreshToken;
          this.headers = {
            "Authorization": `Bearer ${this.accessToken}`
          };

          try {
            await axios.get(this.discovery.jwks_uri).then((r: AxiosResponse) => {
              /* ajm: try {
                _logger.LogInformation(`identity: get jwks: ${r.status} ${r.statusText} data: ${JSON.stringify(r.data, null, 2)}`);
                ajm: const publicKey: string = jwktopem(r.data.keys[1]);
                _logger.LogInformation(`identity: public key: ${publicKey}`);
                const token: jsonwebtoken.JwtPayload | string= jsonwebtoken.verify(this.accessToken || "", publicKey, { complete: true, algorithms: ["RS256"] });
                if (token) {
                  _logger.LogInformation(`jsonwebtoken.verify(access token): ${JSON.stringify(token, null, 2)}`);
                } else {
                  _logger.LogError(`Invalid access token`);
                }    
              } catch(e) {
                _logger.LogException(e as any);
              }*/
            }).catch((e: any) => {
              _logger.LogAxiosError(e);
            });
          } catch(e) {
            _logger.LogException(e as any);
          }      
    
          if (this.accessToken?.length === 43) {
            if (reload) {
              _logger.LogDebug(`identity: GetToken() uri: ${this.discovery.userinfo_endpoint} data: ${data}`);
              await axios.get(this.discovery.userinfo_endpoint, { headers: this.headers }).then((r: AxiosResponse) => {
                try {
                  _logger.LogInformation(`identity: GetToken() status: ${r.status} ${r.statusText} userinfo: ${JSON.stringify(r.data)}`);
                  this.userInfo = r.data;
                } catch(e) {
                  _logger.LogException(e as any);
                }      
              }).catch((e: any) => {
                _logger.LogAxiosError(e);
              });
            }
          } else {
            this.userInfo = jwt.jwtDecode(r.data.id_token || "");
          }
          sessionStorage.userInfo=JSON.stringify(this.userInfo);
          if (reload) {
            await _configuration.Read();
            // window.location.assign(`${window.location.origin}${_configuration.configuration.ingress}`);
          }
        } catch(e) {
          _logger.LogException(e as any);
        }
      }).catch((e: any) => {
        _logger.LogAxiosError(e);
      });
    } catch(e) {
      _logger.LogException(e as any);
    }
  }

  // ajm: -----------------------------------------------------------------------------------------
  public GetState = (): eOIDCFLOW => {
    const oidcFlow: eOIDCFLOW=sessionStorage.state || eOIDCFLOW.eSIGNEDOUT;
    console.info(`Identity: GetState(${oidcFlow})`);
    return oidcFlow;
  }

  // ajm: -----------------------------------------------------------------------------------------
  public SetState = (oidcFlow: eOIDCFLOW): void => {
    console.info(`Identity: SetState(${oidcFlow})`);
    sessionStorage.state=oidcFlow;
  }

  // ajm: -----------------------------------------------------------------------------------------
  public SignOut = async (): Promise<void> => {
    _logger.LogInformation("identity: SignOut()");
    try {
      const data: any = `client_id=sunstealer_explorer&id_token_hint=${this.identityToken}`;
      _logger.LogDebug(`identity: SignOut() uri: ${this.discovery?.end_session_endpoint} data: ${JSON.stringify(data)}`);
      await axios.post(this.discovery?.end_session_endpoint, data).then(async (r: AxiosResponse) => {
        try {
          let i: number = r.data.indexOf(`action="`);
          if (i!==-1) {
            i+=8;
            let j: number=r.data.indexOf(`"`, i);
            if (j!==-1) {
              const action: string=r.data.substring(i, j);
              i=r.data.indexOf(`value="`);
              if (i!==-1) {
                i+=7;
                j=r.data.indexOf(`"`, i);
                const xsrf: string=r.data.substring(i, j);
                const form: string = `xsrf=${xsrf}&logout=yes`;
          
                _logger.LogDebug(`identity: SignOut() uri: ${action} data: ${form}`);
                await axios.post(action, form).then(async (r: AxiosResponse) => {
                  _logger.LogInformation("Sign out cpmplete.", "Sign out cpmplete.");
                }).catch((e: any) => {
                  _logger.LogAxiosError(e);
                });
              }
            } 
          }
        } catch(e) {
          _logger.LogException(e as any);
        }
      }).catch((e: any) => {
        _logger.LogAxiosError(e);
      });

      this.Stop();
      sessionStorage.clear();
      this.accessToken = null;
      this.code = null;
      this.codeVerifier = null;
      this.identityToken = null;
      this.refreshToken = null;
      this.userInfo = null;
  } catch(e) {
      _logger.LogException(e as any);
    }
  }

  // ajm: -----------------------------------------------------------------------------------------
  public Start = async (): Promise<void> => {
    try {
      const uri: string = `${_configuration.configuration.identity.uri}/.well-known/openid-configuration`;
      _logger.LogDebug(`identity: start() uri: ${uri}`);
      await axios.get(uri).then((r: any) => {
        if (r.status === 200) {
          this.discovery = r.data;
          _logger.LogDebug(`identity: start() discovery: ${JSON.stringify(this.discovery)}`);

          // this.discovery.authorization_endpoint = `${_configuration.configuration.identity.uri}/auth`;
          // this.discovery.end_session_endpoint = `${_configuration.configuration.identity.uri}/session/end`;*/
          // this.discovery.issuer = `http://ajmfco40-01.ajm.net:9001`;
          //  this.discovery.jwks_uri = `${_configuration.configuration.identity.uri}/sunstealer-identity/jwks`;
          // this.discovery.token_endpoint = `${_configuration.configuration.identity.uri}/sunstealer-identity/token`;
          // this.discovery.userinfo_endpoint = `${_configuration.configuration.identity.uri}/sunstealer-identity/me`;*/

          if (!this.interval) {
            _logger.LogInformation(`identity: starting interval ${_configuration.configuration.identity.interval_ms}ms`);
            this.interval = setInterval(() => {
              if (this.accessToken) {
              /* ajm: await*/ this.GetToken();
              }
            }, _configuration.configuration.identity.interval_ms);
          }  
        } else {
          _logger.LogError(`identity: http ${r.status} uri: ${`${uri}`}`);
        }
      }).catch((e: any) => {
        _logger.LogAxiosError(e);
      });
    } catch(e) {
      _logger.LogException(e as any);
    }
  }

  // ajm: -----------------------------------------------------------------------------------------
  public Stop = (): void => {
    try {
      _logger.LogInformation("identity: Stop(), stopping interval");
      clearInterval(this.interval);
    } catch(e) {
      _logger.LogException(e as any);
    }
  }
}