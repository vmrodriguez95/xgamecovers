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
  field: FieldSchema
  dependencies: string[]
}

export interface FieldBlock {
  id: string
  blockLabel: string
  canAdd: boolean
  canDelete: boolean
  messageEmpty?: string
  fields: FormSchema[]
  structure: FormSchema
}

export interface FieldSchema {
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
  fillValue: string|number|boolean
  concatValue?: string
  config?: any
  excludeValue?: boolean
  fieldSize?: string // 'min' | 'half' | 'max' | 'full'
  dependencyActivated?: boolean // Uso exclusivo para las dependencias que se maneja desde el código
  icon?: string
  iconChecked?: string
}

export type FormSchema = Record<string, FieldSchema | FieldBlock>