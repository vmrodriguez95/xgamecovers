export interface Option {
  name: string
  value: string
}

export interface ComplexOption {
  name: string
  value: string
  logo: string
  color: string
}

export interface Dependency {
  field: Fieldscheme
  dependencies: string[]
}

export interface FieldBlock {
  id: string
  blockLabel: string
  canAdd: boolean
  canDelete: boolean
  excludeBlock: boolean
  messageEmpty?: string
  fields: Formscheme[]
  structure: Formscheme
}

export interface Fieldscheme {
  id: string
  name: string
  label: string
  type: string
  checked?: boolean
  autocomplete?: string
  options?: Option[]
  required: boolean
  readonly: boolean
  dependsOn?: string[]
  logo?: string
  helpmsg?: string
  placeholder?: string
  fillValue: string|number|boolean|string[]
  concatValue?: string
  config?: any
  excludeValue?: boolean
  fieldSize?: string // 'min' | 'half' | 'max' | 'full'
  dependencyActivated?: boolean // Uso exclusivo para las dependencias que se maneja desde el código
  icon?: string
  iconChecked?: string
}

export type Formscheme = Record<string, Fieldscheme | FieldBlock>