import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

// BBDD
import { transactionRepository } from '../../domain/transaction/transaction.repository.ts'
import { transactionCategoryRepository } from '../../domain/transaction-category/transaction-category.repository.ts'

// Domain
import { TransactionFormScheme } from '../../domain/transaction/transaction.form.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Types
import { Option } from '../../domain/form/form.types.ts'
import { TransactionCategory } from '../../domain/transaction-category/transaction-category.types.ts'

// Styles
import style from './v-transaction-new.style.scss?inline'

@customElement('v-transaction-new')
class VTransactionNew extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @state() _formscheme = TransactionFormScheme

  @query('c-form') form!: HTMLFormElement

  static styles = css`${unsafeCSS(style)}`

  connectedCallback(): void {
    super.connectedCallback()
    
    this._fillCategoryOptions()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-transaction-new">
          <c-form
            class="v-transaction-new__form"
            .scheme=${this._formscheme}
          ></c-form>
          <div class="v-transaction-new__actions">
            <e-button class="v-transaction-new__button" size="full" @click=${this._goBack}>Cancelar</e-button>
            <e-button class="v-transaction-new__button" size="full" @click=${this.createTransaction}>Crear</e-button>
          </div>
        </div>
      `,
      this.heading
    )
  }

  private async _fillCategoryOptions() {
    const allCategory = await transactionCategoryRepository.getAll()
    const newscheme = window.structuredClone(this._formscheme)

    const options: Option[] = allCategory
      .map((category: TransactionCategory) => {
        return {
          value: category.id,
          name: category.name
        }
      })

    if ('options' in newscheme.idCategory) {
      newscheme.idCategory.options = options
    }

    this._formscheme = newscheme
  }

  private createTransaction() {
    const data = this.form.getFinalData()

    if (data) {
      transactionRepository.create(data)
      this._goBack()
    }
  }

  private _goBack() {
    location.href = '/transaction'
  }
}