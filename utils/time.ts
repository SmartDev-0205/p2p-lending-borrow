export const getDays = (month: number, year: number) => {
  return new Date(year, month, 0).getDate()
}

export const formatTimestamp = (timestamp: number | string) => {
  const date = new Date(Number(timestamp))
  let formated =
    date.getHours() + ':' + date.getMinutes() + ', ' + date.toDateString()
  return formated
}
