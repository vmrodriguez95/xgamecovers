export function showDateWithFormat(date: string) {
  const dateObj = new Date(date)
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()

  return `${day}/${month}/${year}`
}

export const getMonthName = (date: string) => {
  const compareDate = new Date()
  compareDate.setMonth(new Date(date).getMonth())
  return compareDate.toLocaleString('default', { month: 'long' })
}

export const getYear = (date: string) => {
  const compareDate = new Date()
  compareDate.setMonth(new Date(date).getMonth())
  return compareDate.toLocaleString('default', { year: 'numeric' })
}