import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { GlobalHeader } from "./components/globalheader" 

import { _configuration, _identity, _logger /*, router*/ } from "./index"
import { eOIDCFLOW } from "./services/identity";

const data: any = {
  error: "none",
  warning: "none"
}

export const GlobalContext = React.createContext(data);

const App = () => {
  useEffect(() => {
    const componentDidUpdate = async () => {
      console.info("componentDidUpdate()");
      if (_identity.GetState() === eOIDCFLOW.eSIGNINGIN) {
        await _identity.AuthorizationCodeFlowPKCE();
      }
    }
    componentDidUpdate();
  });

  document.oncontextmenu = (e: MouseEvent) => {
    e.preventDefault();
  }

  return (
    <div>
      <div>
        <GlobalHeader />
      </div>
      <div style={{ height: "100vh" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
