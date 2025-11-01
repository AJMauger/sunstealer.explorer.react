import React, { MouseEventHandler } from "react";
import "../App.css";
import "../css/table.css";

import { Menu } from "./menu";


// ajm: -------------------------------------------------------------------------------------------
export interface ITableHeaderProps {
  cells: ITableCellProps[];
}

/* ajm: export const TableHeader: React.FC<ITableHeaderProps> = (props: ITableHeaderProps) => {
  return (
    <tr style={{cursor: "default", height: 32}}>
      {props.header.cells.map((cell: any, i: number) => <th key={`h${i}`} style={{ width: cell.width }}>{cell.text}</th>)}
    </tr>
  );
}*/

// ajm: -------------------------------------------------------------------------------------------
export interface ITableRowProps {
  background: string;
  cells: ITableCellProps[];
  OnClick?: (e: React.MouseEvent<HTMLTableRowElement>) => any;
  OnContextMenu?: (e: React.MouseEvent<HTMLTableRowElement>) => any;
}

export const TableRow: React.FC<ITableRowProps> = (props: ITableRowProps) => {

  return (
    <tr className="active" style={{backgroundColor: props.background}}
    onClick={(e: React.MouseEvent<HTMLTableRowElement>) => { if (props.OnClick) { props.OnClick(e);}}} 
    onContextMenu={(e: React.MouseEvent<HTMLTableRowElement, globalThis.MouseEvent>) => { if (props.OnContextMenu) { props.OnContextMenu(e); }}}>
    
    {props.cells.map((cell: any, i: number) => <td style={{height: 20, width: cell.width, userSelect: "none"}}>{cell.content}</td> )}
  </tr>);
}

// ajm: -------------------------------------------------------------------------------------------
interface ITableCellProps {
  content: string; // ajm: => any
  width: string;
}

// ajm: -------------------------------------------------------------------------------------------
export interface ITableProps {
  header: ITableHeaderProps;
  rows: ITableRowProps[];
}

export const Table: React.FC<ITableProps> = (props: ITableProps) => {
  const [menu, SetMenu] = React.useState(false);
  const [selected, SetSelected] = React.useState<HTMLTableRowElement>();  
  const [x, SetX] = React.useState(0);
  const [y, SetY] = React.useState(0);

  React.useEffect(() => {
    console.log("Table.render()");
  });

  return (
    <div style={{ height: "calc(100vh - 36px)", margin: 10, overflowY: "auto", userSelect: "none", width: "calc(100vw-20px)" }}>
      <table style={{borderRadius: 8, display: "block", overflow: "hidden", tableLayout: "fixed"}}>
        <thead>
          <tr style={{cursor: "default", height: 32}}>
            {props.header.cells.map((cell: ITableCellProps, i: number) => <th key={`h${i}`} style={{ width: cell.width }}>{cell.content}</th>)}
          </tr>
        </thead>
        <tbody style={{display: "block", height: "90vh", overflow: "scroll", tableLayout: "fixed"}}>
          {props.rows.map((row: ITableRowProps, i: number) =>
            <TableRow background={row.background} cells={row.cells} key={`row${i}`} 

              OnClick={(e: React.MouseEvent<HTMLTableRowElement>) => {
                const tr: any = (e.target as HTMLElement).parentElement; 
                if (selected) {
                  selected.style.background="var(--color-background-modal)";
                }                
                SetSelected(tr);
                tr.style.background="var(--blue)";
                SetMenu(false);
              }} 

              OnContextMenu={(e: React.MouseEvent<HTMLTableRowElement>) => {
                const tr: any = (e.target as HTMLElement).parentElement; 
                if (selected) {
                  selected.style.background="var(--color-background-modal)";
                }                
                SetSelected(tr);
                tr.style.background="var(--blue)";
                SetX(e.pageX);
                SetY(e.pageY);
                SetMenu(true);
              }} />
          )}
        </tbody>
      </table>

      <Menu open={menu} height={150} width={200} x={x} y={y} 
        options={[
          {text: "Option 1", callback: () => { SetMenu(false); console.log("Event: menu option 1");} }, 
          { }, 
          {text: "Option 2", callback: () => { SetMenu(false); console.log("Event: menu option 1");} }, 
          {text: "Option 3", callback: () => { SetMenu(false); console.log("Event: menu option 1");} }
        ]}>
      </Menu>

    </div>
  );
}
