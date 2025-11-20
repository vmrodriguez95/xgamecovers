export const OrderFormSchema = {
  id: {
    id: 'orderId',
    name: 'id',
    label: 'Identificador',
    type: 'number',
    required: false,
    readonly: true,
    autogenerateValue: true,
    helpmsg: 'El valor de este campo se genera automáticamente cuando se crea'
  },
  idStatus: {
    id: 'orderIdStatus',
    name: 'idStatus',
    label: 'Estado del pedido',
    type: 'select',
    required: true,
    readonly: false,
    autogenerateValue: false
  },
  name: {
    id: 'orderName',
    name: 'name',
    label: 'Nombre',
    type: 'text',
    required: true,
    readonly: false,
    autogenerateValue: false,
  },
  whatsapp: {
    id: 'orderWhatsapp',
    name: 'whatsapp',
    label: 'Nombre Whatsapp',
    type: 'text',
    logo: 'whatsapp', // El logo va al lado del label y se saca de los pngs de las imágenes.
    required: false,
    readonly: false,
    autogenerateValue: false,
  },
  wallapop: {
    id: 'orderWallapop',
    name: 'wallapop',
    label: 'Nombre Wallapop',
    type: 'text',
    logo: 'wallapop', // El logo va al lado del label y se saca de los pngs de las imágenes.
    required: false,
    readonly: false,
    autogenerateValue: false,
  },
  instagram: {
    id: 'orderInstagram',
    name: 'instagram',
    label: 'Nombre Instagram',
    type: 'text',
    logo: 'instagram', // El logo va al lado del label y se saca de los pngs de las imágenes.
    required: false,
    readonly: false,
    autogenerateValue: false,
  },
  vinted: {
    id: 'orderVinted',
    name: 'vinted',
    label: 'Nombre Vinted',
    type: 'text',
    logo: 'vinted', // El logo va al lado del label y se saca de los pngs de las imágenes.
    required: false,
    readonly: false,
    autogenerateValue: false,
  },
  discount: {
    id: 'orderDiscount',
    name: 'discount',
    label: 'Descuento aplicado',
    type: 'hidden',
    required: false,
    readonly: false,
    autogenerateValue: false
  },
  finalPrice: {
    id: 'orderFinalPrice',
    name: 'finalPrice',
    label: 'Precio final',
    type: 'number',
    required: false,
    readonly: false,
    autogenerateValue: false
  },
  address: {
    id: 'orderAddress',
    name: 'address',
    label: 'Dirección',
    type: 'textarea',
    required: false,
    readonly: false,
    autogenerateValue: false,
  },
  designs: {
    id: 'orderDesigns',
    name: 'designs',
    label: 'Diseños',
    type: 'hidden',
    required: false,
    readonly: false,
    autogenerateValue: false
  }
}