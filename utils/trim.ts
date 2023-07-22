import fromExponential from 'from-exponential'

export const trim = (number: number | string, precision?: number) => {
  const array = fromExponential(number).split('.')
  if (array.length === 1) return fromExponential(number)
  //@ts-ignore
  array.push(array.pop().substring(0, precision ?? 3))
  const trimmedNumber = array.join('.')
  return trimmedNumber
}
