import { Option } from "../form/form.types";

export const TransactionFormSchema = {
  id: {
    id: 'orderId',
    name: 'id',
    label: 'Identificador',
    type: 'hidden',
    value: '',
    fillValue: '',
    required: false,
    readonly: true
  },
  idCategory: {
    id: 'orderIdCategory',
    name: 'idCategory',
    label: 'Categoría',
    type: 'select',
    value: '',
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
    value: 0,
    fillValue: 0,
    required: true,
    readonly: false
  }
}