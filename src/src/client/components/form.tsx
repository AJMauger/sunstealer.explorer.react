import React from "react";
import "../App.css";

// ajm: -------------------------------------------------------------------------------------------
export interface IFormProps {
  array: string[],
  number: number;
  select: number;
  string: string;
}

interface IState {
  array: string[],
  number: number;
  select: number;
  string: string;
}

export const Form: React.FC<IFormProps> = (props: IFormProps) => {

  // ajm: -----------------------------------------------------------------------------------------
  return (
    <div style={{ height: "calc(100vh - 36px)", margin: 10, overflowY: "auto", userSelect: "none", width: "calc(100vw-20px)" }}>
      <div style={{backgroundColor: "var(--color-background-modal)", borderRadius: 8, display: "flex", flexDirection: "row", padding: 20}}>
      </div>
    </div>
  );
}

  