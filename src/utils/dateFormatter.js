import dayjs from 'dayjs';

export const dateFormatter = (date) => {
  return dayjs(date).format('DD-MMM-YYYY h:mmA');
};

export const getCurrentISTTimestamp = () => {
  const currentDate = new Date();
  const offsetInMinutes = 330; // Indian Standard Time (IST) offset from UTC

  const adjustedTimestamp = new Date(
    currentDate.getTime() + offsetInMinutes * 60000,
  );
  const timestampString = adjustedTimestamp
    .toISOString()
    .replace('Z', '+00:00');

  return timestampString;
};
