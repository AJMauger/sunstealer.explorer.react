import React, { useEffect } from "react";
import * as jwt from "jwt-decode";
import { _configuration, _identity, _logger } from "../index";
import "../App.css";
import "../css/table.css";

interface Props {
}

export const Authorization = (props: Props) => {
  useEffect(() => {
    const componentDidUpdate = () => {
    }
    componentDidUpdate();
  });

  useEffect(() => {
    const componentDidMount = () => {
    }
    componentDidMount();
    return () => {
    };
  });

  return (
    <div style={{ height: "calc(100vh - 36px)", overflowY: "auto", userSelect: "none", width: "100vw" }}>
      <table cellPadding={2} style={{ width: "99vw" }}>
        <thead>
          <tr style={{ height: 32 }}>
            <th style={{ width: "100px" }}>Key</th>
            <th style={{ width: "1000px" }}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{verticalAlign: "top"}}>access_token</td><td>{_identity.accessToken?.length === 43 ? _identity.accessToken : JSON.stringify(_identity.accessToken ? jwt.jwtDecode(_identity.accessToken) : {}, null, 2)}</td>
          </tr>
          <tr>
            <td style={{verticalAlign: "top"}}>identity_token</td><td>{JSON.stringify(_identity.identityToken ? jwt.jwtDecode(_identity.identityToken) : {}, null, 2)}</td>
          </tr>
          <tr>
            <td style={{verticalAlign: "top"}}>refresh_token</td><td>{_identity.refreshToken}</td>
          </tr>
          <tr>
            <td style={{verticalAlign: "top"}}>user</td><td>{JSON.stringify(_identity.userInfo, null, 2)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Authorization;
