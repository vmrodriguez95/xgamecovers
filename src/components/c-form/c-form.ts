import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { classMap } from 'lit/directives/class-map.js'

// Types
import { FieldSchema, FieldBlock, FormSchema, Dependency } from '../../domain/form/form.types.ts'

// Styles
import style from './c-form.style.scss?inline'

@customElement('c-form')
class CForm extends LitElement {

  @property({ type: String }) method = ''

  @property({ type: String }) action = ''

  @property({ type: Object }) schema: FormSchema = {}

  @query('.c-form') form!: HTMLFormElement

  dependencies: Dependency[] = []

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
          ${this._printTemplate()}
        </fieldset>
      </form>
    `
  }

  updated() {
    this._activateDependencies()
  }

  private _getInputClasses(field: FieldSchema) {
    return classMap({
      'c-form__field': true,
      'c-form__field--full': field.fieldSize === 'full'
    })
  }

  private _getFieldByType(field: FieldSchema, index: number = 0) {
    if (field.concatValue) {
      field.concatValue = field.concatValue.replace('${index}', `${index}`)
    }

    if (field.dependsOn) {
      this.dependencies.push({
        field,
        dependencies: field.dependsOn
      })
    }

    switch (field.type) {
      case 'text':
      case 'date':
      case 'hidden':
      case 'number':
        return html`
          <e-input
            id=${field.id}
            class=${this._getInputClasses(field)}
            name=${field.name}
            label=${field.label}
            type=${field.type}
            logo=${field.logo}
            ?required=${field.required}
            ?readonly=${field.readonly}
            helpmsg=${field.helpmsg}
            value=${field.fillValue}
            placeholder=${field.placeholder}
            @input=${this._updateSchemaValue.bind(this, field)}
          ></e-input>
        `
      case 'file':
        return html`
          <e-input-file
            id=${field.id}
            class=${this._getInputClasses(field)}
            name=${field.name}
            label=${field.label}
            ?required=${field.required}
            ?readonly=${field.readonly}
            maxSize=${field.config.maxSize}
            accept=${field.config.accept}
            helpmsg=${field.helpmsg}
            value=${field.fillValue}
            placeholder=${field.placeholder}
            @change=${this._updateSchemaValue.bind(this, field)}
          ></e-input>
        `
      case 'textarea':
        return html`
          <e-textarea
            id=${field.id}
            class=${this._getInputClasses(field)}
            name=${field.name}
            label=${field.label}
            ?required=${field.required}
            ?readonly=${field.readonly}
            helpmsg=${field.helpmsg}
            value=${field.fillValue}
            placeholder=${field.placeholder}
            @input=${this._updateSchemaValue.bind(this, field)}
          ></e-textarea>
        `
      case 'select':
        return html`
          <e-select
            id=${field.id}
            class=${this._getInputClasses(field)}
            name=${field.name}
            label=${field.label}
            .options=${field.options}
            ?required=${field.required}
            ?readonly=${field.readonly}
            helpmsg=${field.helpmsg}
            value=${field.fillValue}
            placeholder=${field.placeholder}
            @input=${this._updateSchemaValue.bind(this, field)}
          ></e-select>
        `
      default:
        return html`<p>${field.name} no es un campo disponible</p>`
    }
  }

  private _appendFields(block: FieldBlock) {
    const newStructure = window.structuredClone(block.structure)
    block.fields.push(newStructure)
    this.requestUpdate()
  }

  private _getFieldBlock(block: FieldBlock) {
    return html`
      <div class="c-form__block">
        <p class="c-form__heading">${block.blockLabel}</p>
        ${when(block.fields.length === 0, () => html`
          <div class="c-form__empty">
            <p class="c-form__empty__message">${block.messageEmpty}</p>
          </div>
        `, () => html`
          ${map(block.fields, (fields: FormSchema) => html`
            <div class="c-form__block-fields">
              ${when(block.canDelete, () => html`
                <button class="c-form__delete">
                  <e-icon icon="delete"></e-icon>
                </button>
              `)}
              ${map(Object.values(fields), (field: FieldSchema | FieldBlock, index: number) => {
                return this._getFieldByType(field as FieldSchema, index)
              })}
            </div>
          `)}
        `)}
        ${when(block.canAdd, () => html`
          <button class="c-form__add" @click=${this._appendFields.bind(this, block)}>
            <e-icon icon="add"></e-icon>
          </button>
        `)}
      </div>
    `
  }

  private _printTemplate(schema: FormSchema = this.schema): TemplateResult {
    return html`
      ${map(Object.values(schema), (field: FieldBlock | FieldSchema, index: number) => {
        if ('fields' in field) {
          return this._getFieldBlock(field)
        } else {
          if (field.concatValue) {
            field.concatValue = field.concatValue.replace('${index}', `${index}`)
          }
          return this._getFieldByType(field)
        }
      })}
    `
  }

  private _updateSchemaValue(field: FieldSchema, ev: Event) {
    const input = ev.currentTarget as HTMLInputElement

    field.fillValue = input.value
  }

  private _isValid(): boolean {
    return this.form.reportValidity()
  }

  private _onSubmit(ev: Event) {
    ev.preventDefault()
    ev.stopPropagation()
  }

  private concatValueDynamically(field: HTMLInputElement, concatValue: string = '') {
    return field.value && concatValue ? `${field.value}${concatValue}` : field.value
  }

  private _dependencyActionTextToText(mainField: HTMLInputElement, field: HTMLInputElement, concatValue: string = '') {
    mainField.value = this.concatValueDynamically(field, concatValue)
  }

  private _attachDependencyActionTextToText(mainField: HTMLInputElement, field: HTMLInputElement, concatValue: string = '') {
    field.addEventListener('input', () => {
      mainField.value = this.concatValueDynamically(field, concatValue)
      mainField.dispatchEvent(new Event('input'))
    })
  }

  private _associateDependency(dependency: Dependency) {
    const mainField = this.shadowRoot?.querySelector(`#${dependency.field.id}`) as HTMLInputElement

    dependency.dependencies.forEach((dependencyId) => {
      const field = this.shadowRoot?.querySelector(`#${dependencyId}`) as HTMLInputElement

      if (!mainField || !field) {
        return
      }

      if (mainField.type === 'text' && field.type === 'text') {
        this._dependencyActionTextToText(mainField, field, dependency.field.concatValue)
        this._attachDependencyActionTextToText(mainField, field, dependency.field.concatValue)
      }
    })

    dependency.field.dependencyActivated = true
  }

  private _activateDependencies() {
    this.dependencies.forEach((dependency) => {
      if (!dependency.field.dependencyActivated) {
        this._associateDependency(dependency)
      }
    })
  }

  private _mountFinalData(schema: FormSchema) {
    return Object.fromEntries(
      Object.entries(schema).map(([key, field]) => {
        if ('fields' in field) {
          return field.fields.map((deepSchema: FormSchema): [string, any] => {
            return this._mountFinalData(deepSchema)
          })
        } else {
          if (field.concatValue) {
            field.fillValue = `${field.fillValue} ${field.concatValue}`
          }

          return [key, field.fillValue]
        }
      })
    )
  }

  getData() {
    if (this._isValid()) {
      this._mountFinalData(this.schema)
    }

    return null
  }

  getRawData() {
    if (this._isValid()) {
      return this.schema
    }

    return null
  }
}