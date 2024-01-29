import dayjs from 'dayjs'

export const dateFormatter = (date) => {
  console.log('text dateFormatter', dayjs(date).format('DD-MMM-YYYY h:mmA'))
  return dayjs(date).format('DD-MMM-YYYY h:mmA')
}
