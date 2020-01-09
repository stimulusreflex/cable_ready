/// <reference types="node" />
/// <reference types="morphdom" />

export interface Operation {
  name: string,
}

export interface Entries {
  dispatch_event: [],
  morph: [],
  inner_html: [],
  outer_html: [],
  text_content: [],
  insert_adjacent_html: [],
  insert_adjacent_text: [],
  remove: [],
  set_value: [],
  set_attribute: [],
  remove_attribute: [],
  add_css_class: [],
  remove_css_class: [],
  set_dataset_property: [],
}

export interface Detail {
  element: HTMLElement,
  name: string,
  value: string,
  html: string,
  childrenOnly: boolean,
  focusSelector: string,
  permanentAttributeName: string,
  text: string,
  position: string,
}

export interface Config {
  element: HTMLElement,
  name: string,
  detail: Detail,
}

enum OperationKind {
    Morph,
    InnerHtml,
    OuterHtml,
    TextContent,
    InsertAdjacentHtml,
    InsertAdjacentText,
    Remove,
    SetValue,
    SetAttribute,
    RemoveAttribute,
    AddCssClass,
    RemoveCssClass,
    SetDatasetProperty,
}

export interface Morph {
  kind: OperationKind.Morph;
  detail: Detail;
}
export interface InnerHtml {
  kind: OperationKind.InnerHtml;
  detail: Detail;
}
export interface OuterHtml {
  kind: OperationKind.OuterHtml;
  detail: Detail;
}
export interface TextContent {
  kind: OperationKind.TextContent;
  detail: Detail;
}
export interface InsertAdjacentHtml {
  kind: OperationKind.InsertAdjacentHtml;
  detail: Detail;
}
export interface InsertAdjacentText {
  kind: OperationKind.InsertAdjacentText;
  detail: Detail;
}
export interface Remove {
  kind: OperationKind.Remove;
  detail: Detail;
}
export interface SetValue {
  kind: OperationKind.SetValue;
  detail: Detail;
}
export interface SetAttribute {
  kind: OperationKind.SetAttribute;
  detail: Detail;
}
export interface RemoveAttribute {
  kind: OperationKind.RemoveAttribute;
  detail: Detail;
}
export interface AddCssClass {
  kind: OperationKind.AddCssClass;
  detail: Detail;
}
export interface RemoveCssClass {
  kind: OperationKind.RemoveCssClass;
  detail: Detail;
}
export interface SetDatasetProperty {
  kind: OperationKind.SetDatasetProperty;
  detail: Detail;
}
