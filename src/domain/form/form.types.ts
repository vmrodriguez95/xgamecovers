export interface Option {
  name: string
  value: string,
  default?: boolean
}

export interface ComplexOption {
  name: string
  value: string
  logo: string
  color: string
}

interface FieldConfig {
  accept: string
  maxSize: number
}

export interface Dependency {
  field: FieldScheme
  index: number | undefined
  cb: ((ev: Event) => void) | null
  dependencies: string[]
  attached?: boolean
}

export interface FieldBlock {
  id: string
  blockLabel: string
  canAdd: boolean
  canDelete: boolean
  excludeBlock: boolean
  messageEmpty?: string
  fields: FormScheme[]
  structure: FormScheme
  fillValue?: any
}

export interface FieldScheme {
  id: string
  name: string
  label: string
  type: string
  checked?: boolean
  autocomplete?: string
  options?: Option[] | ComplexOption[]
  required: boolean
  readonly: boolean
  dependsOn?: string[]
  logo?: string
  helpmsg?: string
  placeholder?: string
  fillValue: string | number | boolean | string[]
  concatValue?: string
  finalConcatValue?: string
  config?: FieldConfig
  additionalData?: Record<string, Option[]>
  excludeValue?: boolean
  fieldSize?: string // 'min' | 'half' | 'max' | 'full'
  dependencyActivated?: boolean // Uso exclusivo para las dependencias que se maneja desde el código
  icon?: string
  iconChecked?: string
  files?: FileList | null
  searchType?: string
}

export type FormScheme = Record<string, FieldScheme | FieldBlock>