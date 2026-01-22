import { FormScheme } from "../form/form.types";

export const ClientFormScheme: FormScheme = {
  id: {
    id: 'clientId',
    name: 'id',
    label: 'Identificador',
    type: 'hidden',
    fillValue: '',
    required: false,
    readonly: true
  },
  name: {
    id: 'clientName',
    name: 'name',
    label: 'Nombre',
    type: 'text',
    fillValue: '',
    required: false,
    readonly: false
  },
  whatsapp: {
    id: 'clientWhatsapp',
    name: 'whatsapp',
    label: 'Nombre Whatsapp',
    type: 'text',
    logo: 'whatsapp', // El logo va al lado del label y se saca de los pngs de las imágenes.
    fillValue: '',
    required: false,
    readonly: false
  },
  wallapop: {
    id: 'clientWallapop',
    name: 'wallapop',
    label: 'Nombre Wallapop',
    type: 'text',
    logo: 'wallapop', // El logo va al lado del label y se saca de los pngs de las imágenes.
    fillValue: '',
    required: false,
    readonly: false
  },
  instagram: {
    id: 'clientInstagram',
    name: 'instagram',
    label: 'Nombre Instagram',
    type: 'text',
    logo: 'instagram', // El logo va al lado del label y se saca de los pngs de las imágenes.
    fillValue: '',
    required: false,
    readonly: false
  },
  vinted: {
    id: 'clientVinted',
    name: 'vinted',
    label: 'Nombre Vinted',
    type: 'text',
    logo: 'vinted', // El logo va al lado del label y se saca de los pngs de las imágenes.
    fillValue: '',
    required: false,
    readonly: false
  },
  address: {
    id: 'clientAddress',
    name: 'address',
    label: 'Dirección',
    type: 'textarea',
    fillValue: '',
    required: false,
    readonly: false
  }
}