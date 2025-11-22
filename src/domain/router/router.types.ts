export interface Route {
  path: string
  render?: (params?: any) => unknown
  enter?: () => void
}