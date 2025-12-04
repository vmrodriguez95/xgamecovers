import { Formscheme, Option } from "../form/form.types";

export const CatalogueFormscheme: Formscheme = {
  id: {
    id: 'catalogueId',
    name: 'id',
    label: 'Identificador',
    type: 'hidden',
    fillValue: '',
    required: false,
    readonly: true
  },
  name: {
    id: 'catalogueName',
    name: 'name',
    label: 'Nombre del juego',
    type: 'text',
    fillValue: '',
    required: true,
    readonly: false
  },
  designs: {
    id: 'catalogueDesigns',
    blockLabel: 'Diseño',
    canAdd: true,
    canDelete: true,
    excludeBlock: true,
    messageEmpty: 'Aún no has añadido ningún diseño',
    structure: {
      id: {
        id: 'designId',
        name: 'id',
        label: 'Identificador',
        type: 'hidden',
        fillValue: '',
        required: false,
        readonly: true
      },
      idGame: {
        id: 'designIdGame',
        name: 'idGame',
        label: 'Identificador del juego',
        type: 'hidden',
        fillValue: '',
        required: false,
        readonly: true
      },
      name: {
        id: 'designName',
        name: 'name',
        label: 'Nombre',
        type: 'text',
        dependsOn: ['catalogueName'],
        fieldSize: 'max',
        concatValue: ' - v${index}',
        fillValue: '',
        required: false,
        readonly: true
      },
      isFavorite: {
        id: 'designIsFavorite',
        name: 'isFavorite',
        label: '',
        type: 'checkbox',
        icon: 'star-border',
        iconChecked: 'star',
        fieldSize: 'min',
        fillValue: false,
        required: false,
        readonly: false
      },
      poster: {
        id: 'designPoster',
        name: 'poster',
        label: 'Portada',
        type: 'file',
        fillValue: '',
        fieldSize: 'min',
        config: {
          accept: 'image/png, image/jpg, image/jpeg, image/webp',
          maxSize: 1 * 1024 * 1024 // 1MB
        },
        files: null,
        required: false,
        readonly: false
      },
      slipcover: {
        id: 'designSlipcover',
        name: 'slipcover',
        label: 'Diseño',
        type: 'file',
        fillValue: '',
        fieldSize: 'min',
        config: {
          accept: 'image/png, image/jpg, image/jpeg, image/webp',
          maxSize: 1 * 1024 * 1024 // 1MB
        },
        files: null,
        required: false,
        readonly: false
      },
      material: {
        id: 'designMaterial',
        name: 'material',
        label: 'Físico',
        type: 'file',
        fillValue: '',
        fieldSize: 'min',
        config: {
          accept: 'image/png, image/jpg, image/jpeg, image/webp',
          maxSize: 1 * 1024 * 1024 // 1MB
        },
        files: null,
        required: false,
        readonly: false
      }
    },
    fields: [], // Está vacío a posta subnormal
  },
  consoles: {
    id: 'catalogueConsoles',
    name: 'consoles',
    label: 'Consolas',
    type: 'select-multiple',
    options: [] as Option[],
    fillValue: [],
    required: true,
    readonly: false
  }
}