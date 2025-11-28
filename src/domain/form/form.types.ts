export interface Option {
  name: string
  value: string
}

export interface ComplexOption {
  name: string
  value: string
  icon: string
  color: string
}

export interface Dependency {
  field: FieldSchema
  dependencies: string[]
}

export interface FieldBlock {
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
  options?: Option[]
  required: boolean
  readonly: boolean
  dependsOn?: string[]
  logo?: string
  helpmsg?: string
  placeholder?: string
  fillValue: string|number
  concatValue?: string
  config?: any
  excludeValue?: boolean
  fieldSize?: string
  dependencyActivated?: boolean // Uso exclusivo para las dependencias que se maneja desde el código
}

export type FormSchema = Record<string, FieldSchema | FieldBlock>