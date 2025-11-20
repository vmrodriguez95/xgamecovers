export interface Option {
  name: string
  value: string | number
}

export interface FieldSchema {
  id: string
  name: string
  label: string
  type: string
  options?: Option[]
  required: boolean
  readonly: boolean
  autogenerateValue: boolean
  logo?: string
  helpmsg?: string
  placeholder?: string
  value: string|number
}

export type FormSchema = Record<string, FieldSchema>