import { html, LitElement, TemplateResult } from 'lit'

type Constructor<T = {}> = new (...args: any[]) => T;

export const ALayout = <T extends Constructor<LitElement>>(superClass: T) => {
  class ALayoutClass extends superClass {

    /**
     * Methods
     */
    layoutGrid(content: TemplateResult) {
      return html`
        <e-layout>
          ${ content }
        </e-layout>
      `
    }
  }

  return ALayoutClass
}

