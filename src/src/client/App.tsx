import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";

import { _configuration, _identity, _logger } from "./index"
import { GlobalHeader } from "./components/globalheader"

const data: any = {
  error: "none",
  warning: "none"
}

export const GlobalContext = React.createContext(data);
  
const App = () => {
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
