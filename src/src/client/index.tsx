import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from "react-redux";
import App from "./App";

import { statusSlice } from "./redux/slices"
import { Configuration } from "./services/configuration";
import { Identity } from "./services/identity";
import { Logger } from "./services/logger";

import { Authorization } from "./components/authorization";
import { ClassComponent } from "./components/classcomponent";
import { FunctionalComponent } from "./components/functionalcomponent";
import { Home } from "./components/home";

export const _logger: Logger = new Logger();
export const _configuration: Configuration = new Configuration();
export const _identity: Identity = new Identity();

// https://redux-toolkit.js.org/usage/usage-with-typescript
export const store = configureStore({
  reducer: {
    status: statusSlice.reducer
  },
  middleware: []
});

const router: any = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/authorization" element={<Authorization />} />
      <Route path="/classcomponent" element={<ClassComponent />} />
      <Route path="/functionalcomponent" element={<FunctionalComponent />} />
      <Route path="/oidc" element={<Home />} />
    </Route>
  ),
  {
    basename: _configuration.configuration.ingress  
  }
);

const Render = (): void => {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </React.StrictMode>,
    document.getElementById("root"));
}

(async () => {
  _logger.LogDebug("index.tsx: async () =>");
  _logger.LogDebug(`document.location:  ${JSON.stringify(document.location)}`);
  await _identity.Start().then(() => {
    if (_identity.discovery) {
      Render();
    } else {
      _logger.LogError("!_identity.discovery");
      Render();
    }
  }).catch((e) => {
    _logger.LogException(e);
    Render();
  });
})().catch((e) => {
  _logger.LogError(e);
});

