import { html, LitElement, TemplateResult } from 'lit'

type Constructor<T = {}> = new (...args: any[]) => T;

export const LayoutMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class LayoutClass extends superClass {

    /**
     * Methods
     */
    layoutGrid(heading: string, content: TemplateResult) {
      return html`
        <e-layout heading=${heading}>
          ${ content }
        </e-layout>
      `
    }
  }

  return LayoutClass
}

