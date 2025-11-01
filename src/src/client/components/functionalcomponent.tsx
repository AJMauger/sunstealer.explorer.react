import React from "react";
import "../App.css";

import { _logger } from "../index";
import { GlobalContext } from "../App";
import { Text } from "./controls";
import { StatusFunctional } from "./statusfunctional";

// ajm: -------------------------------------------------------------------------------------------
interface IGFCProps {
}

export const FunctionalComponent: React.FC<IGFCProps> = (props: IGFCProps) => {

  // ajm: -----------------------------------------------------------------------------------------
  const usecontext = React.useContext(GlobalContext);
  const [update, SetUpdate] = React.useState<boolean>(false);

  // ajm: -----------------------------------------------------------------------------------------
  const stateReducer = { count: 0 };
  const Reducer = (state: any, action: any): any => {
    switch (action.type) {
      case "increment":
        return { count: state.count + 1 };
      case "decrement":
        return { count: state.count - 1 };
      default:
        throw new Error("Reducer(): Invalid action");
    }
  }
  const [usereducer, ReducerDispatch] = React.useReducer(Reducer, stateReducer);

  // ajm: -----------------------------------------------------------------------------------------
  const [userefstate, SetUseRefState] = React.useState<any>(null);
  const useref: React.MutableRefObject<any> = React.useRef(null);

  // ajm: -----------------------------------------------------------------------------------------
  const [usestate, SetUseState] = React.useState<any>({ count: 0 });
  _logger.LogInformation(`FunctionalComponent React.useState: ${JSON.stringify(usestate)}`);

  // ajm: -----------------------------------------------------------------------------------------
  const usecallback = React.useCallback(() => { return { count: usestate.count }; }, [usestate.count]);

  // ajm: -----------------------------------------------------------------------------------------
  const usememo = React.useMemo(() => { return { count: usestate.count }; }, [usestate.count]);

  // ajm: -----------------------------------------------------------------------------------------
  React.useEffect(() => {
    _logger.LogInformation(`FunctionalComponent React.useEffect()`);
    SetUseRefState(useref.current.id);
    return () => {
      _logger.LogInformation(`return FunctionalComponent React.useEffect()`);
    };
  }, [usememo]);

  return (
    <div style={{ height: "calc(100vh - 36px)", margin: 10, overflowY: "auto", userSelect: "none", width: "calc(100vw-20px)" }}>
      <div style={{ backgroundColor: "var(--color-background-modal)", borderRadius: 8 }}>
        <table style={{ width: "90%" }}>
          <tbody>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>useCallback</td>
              <td><pre>{JSON.stringify(usecallback())}</pre></td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ backgroundColor: "var(--color-background-modal)", borderRadius: 8 }}>
        <table style={{ width: "90%" }}>
          <tbody>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>useContext</td>
              <td><pre>{JSON.stringify(usecontext)}</pre></td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ backgroundColor: "var(--color-background-modal)", borderRadius: 8 }}>
        <table style={{ width: "90%" }}>
          <tbody>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>useDebugValue</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ backgroundColor: "var(--color-background-modal)", borderRadius: 8 }}>
        <table style={{ width: "90%" }}>
          <tbody>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>useEffect</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ backgroundColor: "var(--color-background-modal)", borderRadius: 8 }}>
        <table style={{ width: "90%" }}>
          <tbody>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>useImperativeValue</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ backgroundColor: "var(--color-background-modal)", borderRadius: 8 }}>
        <table style={{ width: "90%" }}>
          <tbody>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>useLayoutEffect</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ backgroundColor: "var(--color-background-modal)", borderRadius: 8 }}>
        <table style={{ width: "90%" }}>
          <tbody>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>useMemo</td>
              <td><pre>{JSON.stringify(usememo)}</pre></td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ backgroundColor: "var(--color-background-modal)", borderRadius: 8 }}>
        <table style={{ width: "90%" }}>
          <tbody>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>useReducer</td>
              <td style={{ alignItems: "center", display: "flex", flexDirection: "row", width: 200 }}>
                <div style={{ width: 100 }}><pre>{JSON.stringify(usereducer)}</pre></div>
                <div style={{ color: "var(--blue)", cursor: "pointer", fontSize: 32, height: 32, padding: 0, width: 25 }} onClick={(e) => ReducerDispatch({ type: "increment" })}>+</div>
                <div style={{ color: "var(--blue)", cursor: "pointer", fontSize: 32, height: 32, padding: 0, width: 25 }} onClick={(e) => ReducerDispatch({ type: "decrement" })}>-</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ backgroundColor: "var(--color-background-modal)", borderRadius: 8 }}>
        <table style={{ width: "90%" }}>
          <tbody>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>useRef</td>
              <td ref={useref} id="ID">{userefstate}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ backgroundColor: "var(--color-background-modal)", borderRadius: 8 }}>
        <table style={{ width: "90%" }}>
          <tbody>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>useState</td>
              <td style={{ alignItems: "center", display: "flex", flexDirection: "row", width: 200 }}>
                <div style={{ width: 100 }}><pre>{JSON.stringify(usestate)}</pre></div>
                <div style={{ color: "var(--blue)", cursor: "pointer", fontSize: 32, height: 32, padding: 0, width: 25 }} onClick={(e) => { SetUseState({ count: usestate.count + 1 }); }}>+</div>
                <div style={{ color: "var(--blue)", cursor: "pointer", fontSize: 32, height: 32, padding: 0, width: 25 }} onClick={(e) => { SetUseState({ count: usestate.count - 1 }); }}>-</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{ marginBottom: 5, marginTop: 5 }} />
      <div style={{ backgroundColor: "var(--color-background-modal)", borderRadius: 8 }}>
        <table style={{ width: "90%" }}>
          <tbody>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>error</td>
              <td>
                <Text style={{ fontSize: 16 }} help="Error" placeholder="error" value={usecontext.error} OnChange={(value: string) => { usecontext.error = value; SetUpdate(!update) }} />
              </td>
            </tr>
            <tr>
              <td style={{ color: "gray", verticalAlign: "top", width: 200 }}>warning</td>
              <td>
                <Text style={{ fontSize: 16 }} help="Warning" placeholder="warning" value={usecontext.warning} OnChange={(value: string) => { usecontext.warning = value; SetUpdate(!update) }} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <hr style={{ marginBottom: 5, marginTop: 5 }} />
      <StatusFunctional height="100" />
    </div>
  );
}
