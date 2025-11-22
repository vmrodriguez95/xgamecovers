import { html, LitElement, TemplateResult } from 'lit'

type Constructor<T = {}> = new (...args: any[]) => T;

export const LayoutMixin = <T extends Constructor<LitElement>>(superClass: T) => {
  class LayoutClass extends superClass {

    /**
     * Methods
     */
    layoutGrid(content: TemplateResult, heading: string = '') {
      return html`
        <e-layout heading=${heading}>
          ${ content }
        </e-layout>
      `
    }
  }

  return LayoutClass
}

