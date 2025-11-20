export interface FieldSchema {
  id: string,
  name: string,
  label: string,
  type: string,
  required: boolean,
  readonly: boolean,
  autogenerateValue: boolean,
  logo?: string,
  helpmsg?: string
  placeholder?: string
  value: string|number
}

export type FormSchema = Record<string, FieldSchema>