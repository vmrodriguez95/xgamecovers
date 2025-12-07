import { FormScheme, Option } from "../form/form.types";

export const TransactionFormScheme: FormScheme = {
  id: {
    id: 'orderId',
    name: 'id',
    label: 'Identificador',
    type: 'hidden',
    fillValue: '',
    required: false,
    readonly: true
  },
  idCategory: {
    id: 'orderIdCategory',
    name: 'idCategory',
    label: 'Categoría',
    type: 'select',
    fillValue: '',
    options: [] as Option[],
    required: true,
    readonly: false
  },
  amount: {
    id: 'orderAmount',
    name: 'amount',
    label: 'La viruji',
    type: 'number',
    fillValue: 0,
    required: true,
    readonly: false
  }
}