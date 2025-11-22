import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

// Types
import { FieldSchema, FormSchema } from '../../domain/form/form.types.ts'

// Styles
import style from './c-form.style.scss?inline'

@customElement('c-form')
class CForm extends LitElement {

  @property({ type: String }) method = ''

  @property({ type: String }) action = ''

  @property({ type: Object }) schema: FormSchema = {}

  @query('.c-form') form!: HTMLFormElement

  static styles = css`${unsafeCSS(style)}`

  render() {
    return html`
      <form
        class="c-form"
        action=${this.action}
        method=${this.method}
        @submit=${this._onSubmit}
      >
        <fieldset class="c-form__content">
          ${map(Object.keys(this.schema), (fieldKey: string) => {
            const field = this.schema[fieldKey] as FieldSchema

            return this._getFieldByType(field)
          })}
        </fieldset>
      </form>
    `
  }

  private _getFieldByType(field: FieldSchema) {
    switch (field.type) {
      case 'text':
      case 'date':
      case 'hidden':
      case 'number':
        return html`
          <e-input
            id=${field.id}
            class="c-form__field"
            name=${field.name}
            label=${field.label}
            type=${field.type}
            logo=${field.logo}
            ?required=${field.required}
            ?readonly=${field.readonly}
            helpmsg=${field.helpmsg}
            fillVvalue=${field.value}
            placeholder=${field.placeholder}
            @input=${this._updateSchemaValue}
          ></e-input>
        `
      case 'textarea':
        return html`
          <e-textarea
            id=${field.id}
            class="c-form__field"
            name=${field.name}
            label=${field.label}
            ?required=${field.required}
            ?readonly=${field.readonly}
            helpmsg=${field.helpmsg}
            fillValue=${field.value}
            placeholder=${field.placeholder}
            @input=${this._updateSchemaValue}
          ></e-textarea>
        `
      case 'select':
        return html`
          <e-select
            id=${field.id}
            class="c-form__field"
            name=${field.name}
            label=${field.label}
            .options=${field.options}
            ?required=${field.required}
            ?readonly=${field.readonly}
            helpmsg=${field.helpmsg}
            fillValue=${field.value}
            placeholder=${field.placeholder}
            @input=${this._updateSchemaValue}
          ></e-select>
        `
      default:
        return html`<p>${field.name} no es un campo disponible</p>`
    }
  }

  private _updateSchemaValue(ev: Event) {
    const input = ev.currentTarget as HTMLInputElement

    this.schema[input.name].value = input.value
  }

  private _isValid(): boolean {
    return this.form.reportValidity()
  }

  private _onSubmit(ev: Event) {
    ev.preventDefault()
    ev.stopPropagation()
  }

  getData() {
    if (this._isValid()) {
      return Object.fromEntries(
        Object.entries(this.schema).map(([key, value]) => {
          return [key, value.value]
        })
      )
    }

    return null
  }
}