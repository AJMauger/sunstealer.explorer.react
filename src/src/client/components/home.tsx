import React, { useEffect } from "react";
import { _configuration, _identity, _logger } from "../index";
import "../App.css";
import "../css/table.css";

interface Props {
}

export const Home = (props: Props) => {
  document.oncontextmenu = (e: MouseEvent) => {
    e.preventDefault();
  }

  return (
    <pre style={{ height: "calc(100vh - 36px)", overflowY: "auto" }}>
      { _identity.discovery ? JSON.stringify(_identity.discovery, null, 2) : ""}
    </pre>
    );
}

export default Home;
