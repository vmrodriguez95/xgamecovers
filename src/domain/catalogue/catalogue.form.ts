import { Option } from "../form/form.types";

export const CatalogueFormSchema = {
  id: {
    id: 'catalogueId',
    name: 'id',
    label: 'Identificador',
    type: 'hidden',
    value: '',
    fillValue: '',
    required: false,
    readonly: true
  },
  name: {
    id: 'catalogueName',
    name: 'name',
    label: 'Nombre del juego',
    type: 'text',
    value: '',
    fillValue: '',
    required: true,
    readonly: false
  },
  designs: {
    blockLabel: 'Diseños',
    canAdd: true,
    canDelete: true,
    messageEmpty: 'Aún no has añadido ningún diseño',
    structure: {
      id: {
        id: 'designId',
        name: 'id',
        label: 'Identificador',
        type: 'hidden',
        value: '',
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
        value: '',
        fieldSize: 'full',
        fillValue: '',
        required: false,
        readonly: true,
        excludeValue: true
      },
      posterUrl: {
        id: 'designPosterUrl',
        name: 'posterUrl',
        label: 'Portada',
        type: 'file',
        value: '',
        fillValue: '',
        config: {
          accept: 'image/png, image/jpg, image/jpeg, image/webp',
          maxSize: 1 * 1024 * 1024 // 1MB
        },
        required: false,
        readonly: false,
        excludeValue: true
      },
      slipcoverUrl: {
        id: 'designSlipcoverUrl',
        name: 'slipcoverUrl',
        label: 'Portada',
        type: 'file',
        value: '',
        fillValue: '',
        config: {
          accept: 'image/png, image/jpg, image/jpeg, image/webp',
          maxSize: 1 * 1024 * 1024 // 1MB
        },
        required: false,
        readonly: false,
        excludeValue: true
      },
      favorite: {
        id: 'designFavorite',
        name: 'favorite',
        label: '',
        type: 'checkbox',
        value: false,
        fillValue: false,
        required: false,
        readonly: false,
        excludeValue: true
      }
    },
    fields: [],
    platforms: {
      id: 'cataloguePlatforms',
      name: 'platforms',
      label: 'Plataformas',
      type: 'selectMultiple',
      options: [] as Option[],
      value: [],
      fillValue: [],
      required: true,
      readonly: false
    }
  }
}