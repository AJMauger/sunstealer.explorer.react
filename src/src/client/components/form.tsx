import React from "react";
import { ArrayFieldTemplateProps, FieldTemplateProps, RJSFSchema, RJSFValidationError } from "@rjsf/utils";
import RJSFForm, { IChangeEvent } from "@rjsf/core";
import * as RJSFValidator from "@rjsf/validator-ajv8";
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

// ajm: -------------------------------------------------------------------------------------------
export const FormArrayItem: React.FC<any> = (props: any) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {props.hasRemove && 
        <button style={{ backgroundColor: "var(--color-background-modal)", color: "lightgray", fontSize: 24, width: 30 }} type="button"
          onClick={props.onDropIndexClick(props.index)}>-</button>}

        <div style={{ border: "3px gray solid", borderRadius: 4, margin: 2, marginRight: 10, paddingRight: 10 }}>{props.children}</div>

      {props.hasMoveDown && <button className="main-toolbar-icon icon-chevron-down" style={{ backgroundColor: "var(--color-background-modal)", height: 24, width: 24 }} type="button"
        onClick={props.onReorderClick(props.index, props.index + 1)}></button>}

      {props.hasMoveUp && <button className="main-toolbar-icon icon-chevron-up" style={{ backgroundColor: "var(--color-background-modal)", height: 24, width: 24 }} type="button" 
        onClick={props.onReorderClick(props.index, props.index - 1)}></button>}
    </div>);
}

export const Form: React.FC<IFormProps> = (props: IFormProps) => {

  console.log(`Form::Form(${JSON.stringify(props)})`);

  const [formData, setFormData] = React.useState<IState>( props );
  
  // ajm: -----------------------------------------------------------------------------------------
 const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  return ( 
    <div>
      {props.items.map(element => FormArrayItem(element))}
      {props.canAdd && <button style={{borderRadius: 25, fontSize: 24, fontWeight: "bold", width: 30}} type="button" onClick={props.onAddClick}>+</button>}
    </div>);
}

  // ajm: -----------------------------------------------------------------------------------------
  const fieldTemplate = (ftp: FieldTemplateProps) => {
    console.log(`Template(${ftp.id} ${ftp.label})`);
    switch(ftp.id) {
      case "root":
        return (
          <div style={{height: 150, width: 400}}>
            {ftp.children}
          </div>);
      case "root_Array":
        return (
          <div style={{display: "flex", flexDirection: "row", padding: 2}}>
            <div style={{alignItems: "center", display: "flex", width: 200}}>Array {formData.array}</div>
            {ftp.children}
          </div>);
      case "root_Number":
        return (
          <div style={{display: "flex", flexDirection: "row", padding: 2}}>
            <div style={{alignItems: "center", display: "flex", width: 200}}>Number {formData.number}</div>
            {ftp.children}
          </div>);
      case "root_String":
        return (
          <div style={{display: "flex", flexDirection: "row", padding: 2}}>
            <div style={{alignItems: "center", display: "flex", width: 200}}>String {formData.string}</div>
            {ftp.children}
          </div>);
      default:
        return (
          <div style={{display: "flex", flexDirection: "row", padding: 2}}>
            <div style={{alignItems: "center", display: "flex", width: 200}}>{ftp.label} (ftp.id: {ftp.id})</div>
            {ftp.children}
          </div>
        );    
    }
  }

  const [schema, setSchema] = React.useState<RJSFSchema>({
    type: "object",
    properties: {
      array: {
        default: "",
        title: "Array",
        items: {         
          enum: props.array, 
          type: "string"
        },
        type: "array"
      },
      number: {
        default: "0",
        title: "Number",
        type: "number"
      },
      select: {
        default: 1,
        title: "Select",
        oneOf: [
          {const: 1, title: "One"},
          {const: 2, title: "Two"},
          {const: 3, title: "Three"}
        ],
        type: "number"
      }
    }, 
    dependencies: {
      number: {
        properties: {
          String: {
            default: "string",
            title: "String",
            type: "string"
          }
        }
      }
    },
    title: "Adam's Form"
  });

  const [uiSchema, setUiSchema] = React.useState<RJSFSchema>( 
  {
    array: {
    },
    number: {
    },
    select: {
      "ui:widget": "select"
    },
    string: {
    },
    ArrayFieldTemplate: { 
      ArrayFieldTemplate 
    },
    FieldTemplate: {
      Template: fieldTemplate
    }
  });

  const ref: React.MutableRefObject<any> = React.useRef<any>();

  // ajm: -----------------------------------------------------------------------------------------
  const OnChange = (e: IChangeEvent) => {
    if (e.formData.Select !== formData.select) {
      e.formData.Number = e.formData.select;
    }
    Update(e.formData);
  }

  // ajm: -----------------------------------------------------------------------------------------
  const OnError = (e: any) => {
    console.log(`OnError: ${JSON.stringify(e)}`);        
  }

  // ajm: -----------------------------------------------------------------------------------------
  const OnSubmit = (e: IChangeEvent) => {
    Update(e.formData);
  }

  // ajm: -----------------------------------------------------------------------------------------
  const Update = (data: any) => {
    setFormData(data);
    console.log(`OnSubmit: ${JSON.stringify(data)}`);                
  }

  const additionalMetaSchemas: RJSFValidator.CustomValidatorOptionsType['additionalMetaSchemas'] = [{ }];
  const customFormats: RJSFValidator.CustomValidatorOptionsType['customFormats'] = { };
  const Validator = RJSFValidator.customizeValidator({ additionalMetaSchemas, customFormats });

  // ajm: -----------------------------------------------------------------------------------------
  return (
    <div style={{ height: "calc(100vh - 36px)", margin: 10, overflowY: "auto", userSelect: "none", width: "calc(100vw-20px)" }}>
      <div style={{backgroundColor: "var(--color-background-modal)", borderRadius: 8, display: "flex", flexDirection: "row", padding: 20}}>
        <RJSFForm
          autoComplete="off"
          formData={formData}
          onChange={(e: IChangeEvent) => OnChange(e) }
          onError={(e: RJSFValidationError[]) => OnError(e) }
          onSubmit={(e: IChangeEvent) => OnSubmit(e) }
          ref={ref}
          schema={schema}
          templates={{ ArrayFieldTemplate }}
          uiSchema={uiSchema} 
          validator={Validator}>
        </RJSFForm>

        <textarea style={{border: "1px black solid", margin: 10, marginLeft: 20, width: 300 }}
          defaultValue={JSON.stringify(formData, null, 2)} />

        <textarea style={{border: "1px black solid", margin: 10, width: 300 }} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSchema(JSON.parse(e.target.defaultValue)) }
          defaultValue={JSON.stringify(schema, null, 2)} />

        <textarea style={{border: "1px black solid", margin: 10, width: 300 }} defaultValue={JSON.stringify(uiSchema, null, 2)} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUiSchema(JSON.parse(e.target.defaultValue)) }/>
      </div> 
    </div>
  );
}

  