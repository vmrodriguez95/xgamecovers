import { FormScheme, Option } from "../form/form.types";

export const OrderFormScheme: FormScheme = {
  id: {
    id: 'orderId',
    name: 'id',
    label: 'Identificador',
    type: 'hidden',
    fillValue: '',
    required: false,
    readonly: true
  },
  idStatus: {
    id: 'orderIdStatus',
    name: 'idStatus',
    label: 'Estado del pedido',
    type: 'select',
    fillValue: '',
    options: [] as Option[],
    required: true,
    readonly: false
  },
  name: {
    id: 'orderName',
    name: 'name',
    label: 'Nombre',
    type: 'text',
    fillValue: '',
    required: true,
    readonly: false
  },
  whatsapp: {
    id: 'orderWhatsapp',
    name: 'whatsapp',
    label: 'Nombre Whatsapp',
    type: 'text',
    logo: 'whatsapp', // El logo va al lado del label y se saca de los pngs de las imágenes.
    fillValue: '',
    required: false,
    readonly: false
  },
  wallapop: {
    id: 'orderWallapop',
    name: 'wallapop',
    label: 'Nombre Wallapop',
    type: 'text',
    logo: 'wallapop', // El logo va al lado del label y se saca de los pngs de las imágenes.
    fillValue: '',
    required: false,
    readonly: false
  },
  instagram: {
    id: 'orderInstagram',
    name: 'instagram',
    label: 'Nombre Instagram',
    type: 'text',
    logo: 'instagram', // El logo va al lado del label y se saca de los pngs de las imágenes.
    fillValue: '',
    required: false,
    readonly: false
  },
  vinted: {
    id: 'orderVinted',
    name: 'vinted',
    label: 'Nombre Vinted',
    type: 'text',
    logo: 'vinted', // El logo va al lado del label y se saca de los pngs de las imágenes.
    fillValue: '',
    required: false,
    readonly: false
  },
  discount: {
    id: 'orderDiscount',
    name: 'discount',
    label: 'Descuento aplicado',
    type: 'hidden',
    fillValue: 0,
    required: false,
    readonly: false
  },
  finalPrice: {
    id: 'orderFinalPrice',
    name: 'finalPrice',
    label: 'Precio total acordado',
    type: 'number',
    fillValue: 0,
    required: false,
    readonly: false
  },
  address: {
    id: 'orderAddress',
    name: 'address',
    label: 'Dirección',
    type: 'textarea',
    fillValue: '',
    required: false,
    readonly: false
  },
  totalItems: {
    id: 'orderTotalItems',
    name: 'totalItems',
    label: 'Total de diseños',
    type: 'hidden',
    fillValue: 0,
    required: false,
    readonly: false
  }
}