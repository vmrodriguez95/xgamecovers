import { ComplexOption, FormScheme, Option } from "../form/form.types";

export const OrderItemFormScheme: FormScheme = {
  id: {
    id: 'orderItemId',
    name: 'id',
    label: 'Identificador',
    type: 'hidden',
    fillValue: '',
    required: false,
    readonly: true
  },
  idOrder: {
    id: 'orderItemIdOrder',
    name: 'idOrder',
    label: 'Id del pedido',
    type: 'hidden',
    fillValue: '',
    required: false,
    readonly: false
  },
  idDesign: {
    id: 'orderItemIdDesign',
    name: 'idDesign',
    label: 'Diseños',
    type: 'select-preview',
    fillValue: '',
    options: [] as ComplexOption[],
    required: false,
    readonly: false
  },
  idStatus: {
    id: 'orderItemIdStatus',
    name: 'idStatus',
    label: 'Status',
    type: 'select',
    fillValue: '',
    options: [] as Option[],
    required: false,
    readonly: false
  },
  idConsole: {
    id: 'orderItemIdConsole',
    name: 'idConsole',
    label: 'Consola',
    type: 'select',
    fillValue: '',
    options: [] as Option[],
    required: false,
    readonly: false
  },
  idVersion: {
    id: 'orderItemIdVersion',
    name: 'idVersion',
    label: 'Versión de la consola',
    type: 'select',
    fillValue: '',
    dependsOn: ['orderItemIdConsole'],
    additionalData: {},
    options: [] as Option[],
    required: false,
    readonly: false
  },
  combination: {
    id: 'orderCombination',
    name: 'combination',
    label: 'Combinación',
    type: 'select',
    fillValue: '',
    options: [
      {
        name: 'Juego',
        value: 'Juego'
      },
      {
        name: 'Juego + Juego',
        value: 'Juego + Juego'
      },
      {
        name: 'Juego + Steelbook',
        value: 'Juego + Steelbook'
      },
      {
        name: 'Stealbook + Steelbook',
        value: 'Stealbook + Steelbook'
      },
    ],
    required: false,
    readonly: false
  },
  date: {
    id: 'orderDate',
    name: 'date',
    label: 'Fecha',
    type: 'datetime-local',
    fillValue: '',
    required: false,
    readonly: false
  },
  price: {
    id: 'orderItemPrice',
    name: 'price',
    label: 'Precio del diseño',
    type: 'number',
    fillValue: 0,
    required: false,
    readonly: false
  },
  notes: {
    id: 'orderItemNotes',
    name: 'notes',
    label: 'Anotaciones',
    type: 'textarea',
    fillValue: '',
    required: false,
    readonly: false
  }
}