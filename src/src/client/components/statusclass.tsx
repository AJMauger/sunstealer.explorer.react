import React, { Component } from "react";
import { connect } from "react-redux";
import { _logger } from "../index";

interface IProps {
  store: any;
  height?: string;
  width?: string;
}

export class StatusClass2 extends Component<IProps>
{
  constructor(props: IProps) {
    super(props);
    _logger.LogInformation(`GenericClassComponent()`);
    this.state = {};
  }

  // ajm: -----------------------------------------------------------------------------------------
  static getDerivedStateFromProps(props: any, state: any) {
    _logger.LogInformation(`GenericClassComponent.getDerivedStateFromProps()`);
    return { store: state.store };
  }

  // ajm: -----------------------------------------------------------------------------------------
  public componentDidMount() {
    _logger.LogInformation(`GenericClassComponent.componentDidMount()`);
  }

  // ajm: -----------------------------------------------------------------------------------------
  public componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    _logger.LogInformation(`GenericClassComponent.componentDidUpdate()`);
  }

  // ajm: -----------------------------------------------------------------------------------------
  public componentWillUnmount() {
    _logger.LogInformation("GenericClassComponent.componentDidUnmount()");
  }

  // ajm: -----------------------------------------------------------------------------------------
  public getSnapshotBeforeUpdate(prevProps: any, prevState: any) {
    _logger.LogInformation("GenericClassComponent.getSnapshotBeforeUpdate()");
    return null;
  }

  // ajm: -----------------------------------------------------------------------------------------
  public shouldComponentUpdate() {
    _logger.LogInformation("GenericClassComponent.shouldComponentUpdate()");
    return true;
  }

  // ajm: -----------------------------------------------------------------------------------------
  render() {
    return (
      <div style={{backgroundColor: "var(--color-background-modal)", borderRadius: 8, height: this.props.height, overflow: "hidden", padding: 5, userSelect: "none", width: this.props.width}}>
        <div style={{color: "gray"}}>Status class component</div>
        <div style={{color: "var(--red)", padding: 5}}>{this.props.store.status.error}</div>
        <div style={{color: "var(--yellow)", padding: 5}}>{this.props.store.status.warning}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({ store: state });

export const StatusClass = connect(mapStateToProps)(StatusClass2);
