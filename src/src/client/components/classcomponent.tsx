import React, { Component } from "react";

import { connect } from "react-redux";
import { statusSlice } from "../redux/slices"

import { _logger } from "../index";
import { StatusClass } from "./statusclass";
import { Text } from "./controls";

interface IProps {
  error: (payload: string) => void;
  warning: (payload: string) => void;
  store: any;
}

interface IState {
  store: any;
}

/* ajm: 
mount:
  constructor()
  static getDerivedStateFromProps()
  render()
  componentDidMount()

update:
  static getDerivedStateFromProps()
  shouldComponentUpdate()
  render()
  getSnapshotBeforeUpdate()
  componentDidUpdate()

*/

export class ClassComponent2 extends Component<IProps, IState>
{
  constructor(props: IProps) {
    super(props);
    _logger.LogInformation(`ClassComponent()`);
    this.state = { store: props.store };
  }

  // ajm: -----------------------------------------------------------------------------------------
  static getDerivedStateFromProps(props: any, state: any) {
    _logger.LogInformation(`ClassComponent.getDerivedStateFromProps()`);
    return { store: props.store };
  }

  // ajm: -----------------------------------------------------------------------------------------
  public componentDidMount() {
    _logger.LogInformation(`ClassComponent.componentDidMount()`);
  }

  // ajm: -----------------------------------------------------------------------------------------
  public componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    _logger.LogInformation(`ClassComponent.componentDidUpdate()`);
    if (prevProps.store.error !== this.props.store.error || prevProps.store.warning !== this.props.store.warning) {
      this.setState({ store: this.props.store });
    }
  }

  // ajm: -----------------------------------------------------------------------------------------
  public componentWillUnmount() {
    _logger.LogInformation("ClassComponent.componentDidUnmount()");
  }

  // ajm: -----------------------------------------------------------------------------------------
  public getSnapshotBeforeUpdate(prevProps: any, prevState: any) {
    _logger.LogInformation("ClassComponent.getSnapshotBeforeUpdate()");
    return null;
  }

  // ajm: -----------------------------------------------------------------------------------------
  public shouldComponentUpdate() {
    _logger.LogInformation("ClassComponent.shouldComponentUpdate()");
    return true;
  }

  // ajm: -----------------------------------------------------------------------------------------
  render() {
  
    const font: number = 16;
    const icon: number = 26;

    return (
      <div style={{ fontSize: font, height: "calc(100vh - 36px)", margin: 10, overflowY: "auto", userSelect: "none", width: "calc(100vw-20px)" }}>
        <div style={{backgroundColor: "var(--color-background-modal)", borderRadius: 8}}>
          <div className="label" style={{color: "gray", width: 200}}>redux store</div>
          <pre className="label" style={{width: 500}}>{JSON.stringify(this.state.store, null, 2)}</pre>
        </div>
        <hr />
        <div style={{backgroundColor: "var(--color-background-modal)", borderRadius: 8}}>
          <table style={{margin: 8, width: "100%"}}>
            <tbody>
              <tr>
                <td style={{color: "gray", verticalAlign: "top", width: 200}}>error</td>
                <td>
                  <Text style={{fontSize: 16}} help = "Error" placeholder = "placeholder" value={this.props.store.status.error} OnChange = {(value: string) => this.props.error(value)} />
                </td>
              </tr>
              <tr>
                <td style={{color: "gray", verticalAlign: "top", width: 200}}>warning</td>
                <td>
                  <Text style={{fontSize: 16}} help = "Warning" placeholder = "placeholder" value={this.props.store.status.warning} OnChange = {(value: string) => this.props.warning(value)} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <hr style={{marginBottom: 5, marginTop: 5}} />
        <StatusClass height="100" />
<pre style={{backgroundColor: "var(--color-secondary)", borderRadius: 8, color: "var(--green)", fontSize: 18, height: 600, right: 50, padding: 5, position: "absolute", top: 50, width: 400}}>
  props: {JSON.stringify(this.props, null, 2)}<br />
  state: {JSON.stringify(this.state, null, 2)}
</pre>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({ store: state });

const mapDispatchToProps = (dispatch: any) => {
  return { 
    error: (payload: string) => { dispatch(statusSlice.actions.error(payload)) },
    warning: (payload: string) => { dispatch(statusSlice.actions.warning(payload)) }
  }
}

export const ClassComponent = connect(mapStateToProps, mapDispatchToProps)(ClassComponent2);
