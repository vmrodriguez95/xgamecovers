import { LitElement, html, css, unsafeCSS, TemplateResult } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { repeat } from 'lit/directives/repeat.js'
import { classMap } from 'lit/directives/class-map.js'

// Types
import { Fieldscheme, FieldBlock, Formscheme, Dependency } from '../../domain/form/form.types.ts'

// Styles
import style from './c-form.style.scss?inline'

@customElement('c-form')
class CForm extends LitElement {

  @property({ type: String }) method = ''

  @property({ type: String }) action = ''

  @property({ type: Object }) scheme: Formscheme = {}

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

  private _getInputClasses(field: Fieldscheme) {
    return classMap({
      'c-form__field': true,
      [`c-form__field--${field.fieldSize}`]: field.fieldSize !== '' && field.fieldSize !== undefined
    })
  }

  private _getFieldByType(field: Fieldscheme, index: number = 0) {
    if (field.concatValue) {
      field.concatValue = field.concatValue.replace('${index}', `${index + 1}`)
    }

    if (field.dependsOn && !field.dependencyActivated) {
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
            tabindex="0"
            @input=${this._updateschemeValue.bind(this, field)}
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
            tabindex="0"
            @change=${this._updateschemeValue.bind(this, field)}
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
            tabindex="0"
            @input=${this._updateschemeValue.bind(this, field)}
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
            tabindex="0"
            @input=${this._updateschemeValue.bind(this, field)}
          ></e-select>
        `
      case 'select-multiple':
        return html`
          <e-select-multiple
            id=${field.id}
            class=${this._getInputClasses(field)}
            name=${field.name}
            label=${field.label}
            .options=${field.options}
            ?required=${field.required}
            ?readonly=${field.readonly}
            helpmsg=${field.helpmsg}
            .value=${field.fillValue}
            tabindex="0"
            @change=${this._updateschemeValue.bind(this, field)}
          ></e-select-multiple>
        `
      case 'checkbox':
        return html`
          <e-checkbox
            id=${field.id}
            class=${this._getInputClasses(field)}
            name=${field.name}
            label=${field.label}
            icon=${field.icon}
            iconChecked=${field.iconChecked}
            ?checked=${field.fillValue}
            ?required=${field.required}
            ?readonly=${field.readonly}
            helpmsg=${field.helpmsg}
            tabindex="0"
            @change=${this._updateschemeValue.bind(this, field)}
          ></e-checkbox>
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
        ${when(block.fields.length === 0, () => html`
          <div class="c-form__empty">
            <p class="c-form__empty__message">${block.messageEmpty}</p>
          </div>
        `, () => html`
          ${map(block.fields, (fields: Formscheme, index: number) => html`
            <div class="c-form__block-fields">
              <p class="c-form__heading">${block.blockLabel} ${index + 1}</p>
              ${when(block.canDelete, () => html`
                <button class="c-form__delete">
                  <e-icon icon="delete"></e-icon>
                </button>
              `)}
              ${repeat(
                Object.values(fields),
                (field: Fieldscheme | FieldBlock) => field.id,
                (field: Fieldscheme | FieldBlock) => {
                  return this._getFieldByType(field as Fieldscheme, index)
                }
              )}
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

  private _printTemplate(scheme: Formscheme = this.scheme): TemplateResult {
    return html`
      ${map(Object.values(scheme), (field: FieldBlock | Fieldscheme, index: number) => {
        if ('fields' in field) {
          return this._getFieldBlock(field)
        } else {
          return this._getFieldByType(field)
        }
      })}
    `
  }

  private _updateschemeValue(field: Fieldscheme, ev: Event) {
    const input = ev.currentTarget as HTMLInputElement

    field.fillValue = field.type === 'checkbox' ? input.checked : input.value
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

  private _dependencyActionTextToText(mainField: HTMLInputElement, input: HTMLInputElement, concatValue: string = '') {
    mainField.value = this.concatValueDynamically(input, concatValue)
    mainField.dispatchEvent(new Event('input'))
  }

  private _attachDependencyActionTextToText(mainField: HTMLInputElement, input: HTMLInputElement, concatValue: string = '') {
    input.addEventListener('input', () => {
      mainField.value = this.concatValueDynamically(input, concatValue)
      mainField.dispatchEvent(new Event('input'))
    })
  }

  private _associateDependency(dependency: Dependency) {
    const mainField = this.shadowRoot?.querySelector(`#${dependency.field.id}:not([dependencyActivated])`) as HTMLInputElement
    const dependencyFields = this.shadowRoot?.querySelectorAll(`#${dependency.dependencies.join(', #')}`)

    if (!mainField || !dependencyFields) return
    
    dependencyFields.forEach((field) => {
      const input = field as HTMLInputElement

      if (mainField.type === 'text' && input.type === 'text') {
        this._dependencyActionTextToText(mainField, input, dependency.field.concatValue)
        this._attachDependencyActionTextToText(mainField, input, dependency.field.concatValue)
      }
    })

    dependency.field.dependencyActivated = true
    mainField.setAttribute('dependencyActivated', 'true')
  }

  private _activateDependencies() {
    this.dependencies.forEach((dependency) => {
      if (!dependency.field.dependencyActivated) {
        this._associateDependency(dependency)
      }
    })
  }

  private _mountFinalData(scheme: Formscheme, newScheme: Record<string, any> = {}, applyExcludes: boolean = true) {
    Object.keys(scheme).forEach((key: string) => {
      const field = scheme[key]
      const isBlockField = 'excludeBlock' in field

      if (applyExcludes && isBlockField && field.excludeBlock) return

      // Si es un bloque y no se excluye entramos
      if ('fields' in field) {
        newScheme[key] = []

        field.fields.forEach((deepScheme: Formscheme, index: number) => {
          newScheme[key][index] = this._mountFinalData(deepScheme, {}, applyExcludes)
        })
      }
      // Si es un campo normal y corriente pasamos por aquí
      else{
        newScheme[key] = field.fillValue
      }
    })

    return newScheme
  }

  private _getFinalScheme(applyExcludes: boolean = true) {
    const scheme = window.structuredClone(this.scheme)

    return this._mountFinalData(scheme, {}, applyExcludes)
  }

  getFinalData() {
    if (this._isValid()) {
      return this._getFinalScheme(true)
    }

    return null
  }

  getFullData() {
    if (this._isValid()) {
      return this._getFinalScheme(false)
    }

    return null
  }

  getRawData() {
    if (this._isValid()) {
      return this.scheme
    }

    return null
  }
}