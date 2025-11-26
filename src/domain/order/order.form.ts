import { Option } from "../form/form.types";

export const OrderFormSchema = {
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
  idStatus: {
    id: 'orderIdStatus',
    name: 'idStatus',
    label: 'Estado del pedido',
    type: 'select',
    value: '',
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
    value: '',
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
    value: '',
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
    value: '',
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
    value: '',
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
    value: '',
    fillValue: '',
    required: false,
    readonly: false
  },
  discount: {
    id: 'orderDiscount',
    name: 'discount',
    label: 'Descuento aplicado',
    type: 'hidden',
    value: 0,
    fillValue: 0,
    required: false,
    readonly: false
  },
  finalPrice: {
    id: 'orderFinalPrice',
    name: 'finalPrice',
    label: 'Precio total acordado',
    type: 'number',
    value: 0,
    fillValue: 0,
    required: false,
    readonly: false
  },
  address: {
    id: 'orderAddress',
    name: 'address',
    label: 'Dirección',
    type: 'textarea',
    value: '',
    fillValue: '',
    required: false,
    readonly: false
  },
  designs: {
    id: 'orderDesigns',
    name: 'designs',
    label: 'Diseños',
    type: 'hidden',
    value: [],
    fillValue: [],
    required: false,
    readonly: false
  }
}