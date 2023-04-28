import React from "react";
import ReactDOM from "react-dom";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { configureStore } from '@reduxjs/toolkit'
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Provider } from "react-redux";
import App from "./App";

import { statusSlice } from "./redux/slices"
import { Configuration } from "./services/configuration";
import { Identity } from "./services/identity";
import { Logger } from "./services/logger";

import { Authorization } from "./components/authorization";
import { ClassComponent } from "./components/classcomponent";
import { Controls } from "./components/controls";
import { IFormProps, Form } from "./components/form";
import { FunctionalComponent } from "./components/functionalcomponent";
import { Home } from "./components/home";
import { ITableProps, Table } from "./components/table";

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

const propsForm: IFormProps = {
  array: ["one", "two", "three"],
  number: 6,
  select: 2,
  string: "Six"
};

const propsTable: ITableProps = {
  header: {
    cells: [
      { content: "Column 1", width: "33vw" }, 
      { content: "Column 2", width: "33vw" }, 
      { content: "Column 3", width: "33vw" }
    ] 
  },
  rows: []
}

for (let i: number = 0; i < 30; i++) {
  propsTable.rows.push(
    {
      background: "var(--color-background-modal)",
      cells: [
        { content: `Row ${i+1} Cell 1`, width: "33vw" }, 
        { content: `Row ${i+1} Cell 2`, width: "33vw" }, 
        { content: `Row ${i+1} Cell 3`, width: "33vw" } 
      ]
    });
}



const router: any = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/" element={<App />}>
      <Route path="/" element={<Home />} />
      <Route path="/authorization" element={<Authorization />} />
      <Route path="/classcomponent" element={<ClassComponent />} />
      <Route path="/controls" element={<Controls />} />
      <Route path="/form" element={<Form array={ propsForm.array } number={ propsForm.number } select={ propsForm.select } string={ propsForm.string } />} />
      <Route path="/functionalcomponent" element={<FunctionalComponent />} />
      <Route path="/oidc" element={<Home />} />
      <Route path="/table" element={<Table header={ propsTable.header } rows={ propsTable.rows } />} />
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
      <DndProvider backend={HTML5Backend}>
        <RouterProvider router={router} />
      </DndProvider>
      </Provider>
    </React.StrictMode>,
    document.getElementById("root"));
}

(async () => {
  _logger.LogDebug("index.tsx: async () =>");
  _logger.LogDebug(`document.location:  ${JSON.stringify(document.location)}`);
  _logger.LogDebug(`sessionStorage:  ${JSON.stringify(sessionStorage)}`);
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

