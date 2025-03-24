export interface CustomElementsJson {
  modules: CustomElementsJson.Module[];
}
export namespace CustomElementsJson {
  /**
   * TypeScript type definitions for custom elements metadata
   */

  export interface TypeInfo {
    text: string;
  }

  export interface Parameter {
    name: string;
    description?: string;
    type: TypeInfo;
  }

  export interface Method {
    kind: 'method';
    name: string;
    description?: string;
    privacy?: 'private' | 'protected' | 'public';
    parameters: Parameter[];
    return?: {
      type: TypeInfo;
    };
  }

  export interface Field {
    kind: 'field';
    name: string;
    attribute?: string;
    description?: string;
    type: TypeInfo;
    default?: string;
  }

  export interface Attribute {
    name: string;
    description?: string;
    type: TypeInfo;
    default?: string;
  }

  export interface Event {
    name: string;
    description?: string;
  }

  export interface Slot {
    name: string;
    description?: string;
  }

  export interface CssPart {
    name: string;
    description?: string;
  }

  export interface CssProperty {
    name: string;
    description?: string;
  }

  export interface ClassDeclaration {
    kind: 'class';
    name: string;
    tagName: string;
    description?: string;
    attributes?: Attribute[];
    members: (Method | Field)[];
    events?: Event[];
    slots?: Slot[];
    cssParts?: CssPart[];
    cssProperties?: CssProperty[];
  }
  export interface VariableDeclaration {
    kind: 'variable';
    name: string;
  }
  export type Declaration = ClassDeclaration | VariableDeclaration;

  export interface Module {
    declarations: Declaration[];
  }
}

// Export a type-safe customElements object
import _customElements from '../custom-elements.json' with {type: 'json'};
export const customElementsMetadata = _customElements as CustomElementsJson;

export const customElementDeclarations = customElementsMetadata.modules
  .map((m) => m.declarations)
  .flat()
  .filter((d) => d.kind === 'class');
