import { FormScheme, Option } from "../form/form.types";

export const TransactionFormScheme: FormScheme = {
  id: {
    id: 'transactionId',
    name: 'id',
    label: 'Identificador',
    type: 'hidden',
    fillValue: '',
    required: false,
    readonly: true
  },
  idCategory: {
    id: 'transactionIdCategory',
    name: 'idCategory',
    label: 'Categoría',
    type: 'select',
    fillValue: '',
    options: [] as Option[],
    required: true,
    readonly: false
  },
  idtransaction: {
    id: 'transactionIdOrder',
    name: 'id del pedido',
    label: 'Identificador',
    type: 'hidden',
    fillValue: 0,
    required: false,
    readonly: true
  },
  amount: {
    id: 'transactionAmount',
    name: 'amount',
    label: 'La viruji',
    type: 'number',
    fillValue: 0,
    required: true,
    readonly: false
  }
}