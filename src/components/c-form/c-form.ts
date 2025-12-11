import { LitElement, html, css, unsafeCSS, TemplateResult, PropertyValues } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'
import { when } from 'lit/directives/when.js'
import { repeat } from 'lit/directives/repeat.js'
import { classMap } from 'lit/directives/class-map.js'

// Types
import { FieldScheme, FieldBlock, FormScheme, Dependency } from '../../domain/form/form.types.ts'

// Styles
import style from './c-form.style.scss?inline'

@customElement('c-form')
class CForm extends LitElement {

  @property({ type: String }) method = ''

  @property({ type: String }) action = ''

  @property({ type: Object }) scheme: FormScheme = {}

  @query('.c-form') form!: HTMLFormElement

  _dependencies: Dependency[] = []

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
          ${this._printTemplate(this.scheme)}
        </fieldset>
      </form>
    `
  }

  updated() {
    this._clearAllDependencyListeners()
    this._activateDependencies()
  }

  private _getInputClasses(field: FieldScheme) {
    return classMap({
      'c-form__field': true,
      [`c-form__field--${field.fieldSize}`]: field.fieldSize !== '' && field.fieldSize !== undefined
    })
  }

  private _getFieldByType(field: FieldScheme, index: number | undefined) {
    if (field.concatValue !== undefined && index !== undefined) {
      field.finalConcatValue = field.concatValue.replace('${index}', `${index + 1}`)
    }

    if (field.dependsOn) {
      this._dependencies.push({
        field,
        index,
        cb: null,
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
            id=${index !== undefined ? `${field.id}-${index}` : field.id}
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
            @input=${(ev: Event) => this._updateSchemeValue(field, ev)}
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
            @change=${(ev: Event) => this._updateSchemeValue(field, ev)}
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
            @input=${(ev: Event) => this._updateSchemeValue(field, ev)}
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
            @change=${(ev: Event) => this._updateSchemeValue(field, ev)}
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
            @change=${(ev: Event) => this._updateSchemeValue(field, ev)}
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
            @change=${(ev: Event) => this._updateSchemeValue(field, ev)}
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

  private _removeFields(block: FieldBlock, index: number) {
    block.fields.splice(index, 1)
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
          ${map(block.fields, (fields: FormScheme, index: number) => html`
            <div class="c-form__block-fields">
              <p class="c-form__heading">${block.blockLabel} ${index + 1}</p>
              ${when(block.canDelete, () => html`
                <button class="c-form__delete" @click=${this._removeFields.bind(this, block, index)}>
                  <e-icon icon="delete"></e-icon>
                </button>
              `)}
              ${repeat(
                Object.values(fields),
                (field: FieldScheme | FieldBlock) => field.id,
                (field: FieldScheme | FieldBlock) => {
                  return this._getFieldByType(field as FieldScheme, index)
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

  private _printTemplate(scheme: FormScheme): TemplateResult {
    return html`
      ${map(Object.values(scheme), (field: FieldBlock | FieldScheme) => {
        if ('fields' in field) {
          return this._getFieldBlock(field)
        } else {
          return this._getFieldByType(field, undefined)
        }
      })}
    `
  }

  private _updateSchemeValue(field: FieldScheme, ev: Event) {
    const input = ev.currentTarget as HTMLInputElement

    if (field.type === 'file') {
      field.files = input.files
    }

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

  private _dependencyActionTextToText(mainField: HTMLInputElement, input: HTMLInputElement, dependency: Dependency) {
    mainField.value = this.concatValueDynamically(input, dependency.field.finalConcatValue)
    mainField.dispatchEvent(new Event('input'))
  }

  private _inputHandler(mainField: HTMLInputElement, input: HTMLInputElement, dependency: Dependency) {
    mainField.value = this.concatValueDynamically(input, dependency.field.finalConcatValue)
    mainField.dispatchEvent(new Event('input'))
  }

  private _attachDependencyActionTextToText(mainField: HTMLInputElement, input: HTMLInputElement, dependency: Dependency) {
    if (!dependency.cb) {
      dependency.cb = (ev: Event) => {
        this._inputHandler(mainField, input, dependency)
      }
    }

    if (!dependency.attached) {
      input.addEventListener('input', dependency.cb)
      dependency.attached = true
    }
  }

  private _associateDependency(dependency: Dependency) {
    const mainField = this.shadowRoot?.querySelector(`#${dependency.field.id}${dependency.index !== undefined ? `-${dependency.index}` : ''}`) as HTMLInputElement
    const dependencyFields = this.shadowRoot?.querySelectorAll(`#${dependency.dependencies.join(', #')}`)

    if (!mainField || !dependencyFields) return
    
    dependencyFields.forEach((field) => {
      const input = field as HTMLInputElement

      if (mainField.type === 'text' && input.type === 'text') {
        this._dependencyActionTextToText(mainField, input, dependency)
        this._attachDependencyActionTextToText(mainField, input, dependency)
      }
    })
  }

  private _activateDependencies() {
    this._dependencies.forEach((dependency) => {
      this._associateDependency(dependency)
    })
  }

  private _clearAllDependencyListeners() {
  this._dependencies.forEach((dependency) => {
    if (!dependency.cb) return

    const ids = `#${dependency.dependencies.join(', #')}`
    const fields = this.shadowRoot?.querySelectorAll(ids)

    fields?.forEach(field => {
      field.removeEventListener('input', dependency.cb!)
    })

    dependency.cb = null
  })
}

  private _mountFinalData(scheme: FormScheme, newScheme: Record<string, any> = {}, applyExcludes: boolean = true) {
    Object.keys(scheme).forEach((key: string) => {
      const field = scheme[key]
      const isBlockField = 'excludeBlock' in field

      if (applyExcludes && isBlockField && field.excludeBlock) return

      // Si es un bloque y no se excluye entramos
      if ('fields' in field) {
        newScheme[key] = []

        field.fields.forEach((deepScheme: FormScheme, index: number) => {
          newScheme[key][index] = this._mountFinalData(deepScheme, {}, applyExcludes)
        })
      }
      // Si es un campo normal y corriente pasamos por aquí
      else {
        newScheme[key] = field.fillValue
      }
    })

    return newScheme
  }

  private _getFinalScheme(applyExcludes: boolean = true) {
    const scheme = window.structuredClone(this.scheme)

    return this._mountFinalData(scheme, {}, applyExcludes)
  }

  /**
   * Método usado para obtener los datos finales que se almacenarán en la base de datos.
   *
   * @returns { Record<string, any> | null }
   */
  getFinalData() {
    if (this._isValid()) {
      return this._getFinalScheme(true)
    }

    return null
  }

  /**
   * Método usado para obtener el objeto final que se guardará en la base de datos sin excluir valores.
   *
   * @returns { Record<string, any> | null }
   */
  getFullData() {
    if (this._isValid()) {
      return this._getFinalScheme(false)
    }

    return null
  }

  /**
   * Método usado para obtener los datos en crudo del formulario
   *
   * @returns { FormScheme | null }
   */
  getRawData() {
    if (this._isValid()) {
      return this.scheme
    }

    return null
  }
}