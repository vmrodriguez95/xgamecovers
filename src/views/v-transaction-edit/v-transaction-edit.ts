import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'

// BBDD
import { transactionRepository } from '../../domain/transaction/transaction.repository.ts'
import { transactionCategoryRepository } from '../../domain/transaction-category/transaction-category.repository.ts'

// Domain
import { TransactionFormScheme } from '../../domain/transaction/transaction.form.ts'

// Mixins
import { LayoutMixin } from '../../mixins/layout.mixin.ts'

// Controllers
import { RouterController } from '../../controllers/router.controller.ts'
import { ConfirmController } from '../../controllers/confirm.controller.ts'

// Types
import type { Option } from '../../domain/form/form.types.ts'
import type { URLParam } from '../../domain/generic/generic.types.ts'
import type { Transaction } from '../../domain/transaction/transaction.types.ts'
import type { TransactionCategory } from '../../domain/transaction-category/transaction-category.types.ts'

// Styles
import style from './v-transaction-edit.style.scss?inline'

@customElement('v-transaction-edit')
class VTransactionEdit extends LayoutMixin(LitElement) {

  @property({ type: String }) heading = ''

  @property({ type: Object }) urlParams!: URLParam

  @state() _transaction: Transaction | null = null

  @state() _formscheme = TransactionFormScheme

  _routerController = new RouterController(this)

  _confirmController = new ConfirmController(this)

  @query('c-form') form!: HTMLFormElement

  static styles = css`${unsafeCSS(style)}`

  async connectedCallback() {
    super.connectedCallback()
    
    await this._loadTransaction()
    this._fillCategoryOptions()
    this._fillFormValues()
  }

  render() {
    return this.layoutGrid(
      html`
        <div class="v-transaction-edit">
          <div class="v-transaction-edit__head">
            <button class="v-transaction-edit__delete" @click=${this._deleteHandler}>
              <e-icon icon="delete"></e-icon>
            </button>
          </div>
          <c-form
            class="v-transaction-edit__form"
            .scheme=${this._formscheme}
          ></c-form>
          <div class="v-transaction-edit__actions">
            <e-button class="v-transaction-edit__button" size="full" @click=${this._goBack}>Cancelar</e-button>
            <e-button class="v-transaction-edit__button" size="full" @click=${this._editTransaction}>Guardar</e-button>
          </div>
        </div>
      `,
      this.heading
    )
  }

  private async _loadTransaction() {
    this._transaction = await transactionRepository.getById(this.urlParams.id)
  }

  private _setFormValues(transaction: Transaction) {
    (Object.keys(this._formscheme) as Array<keyof Transaction>).forEach((key) => {
      this._formscheme[key].fillValue = transaction[key]
    })
  }

  private _fillFormValues() {
    if (!this._transaction) return
    this._setFormValues(this._transaction)
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

  private _editTransaction() {
    const data = this.form.getFinalData()

    if (data) {
      transactionRepository.create(data)
      this._goBack()
    }
  }

  async _deleteHandler() {
    if (!this._transaction) return

    const userChoise = await this._confirmController.confirm('¿Realmente quieres eliminar la transacción?')

    if (!userChoise) return

    await transactionRepository.delete(this._transaction.id)

    this._goBack()
  }

  private _goBack() {
    location.href = this._routerController.getAdminRoute('transaction', {})
  }
}