// Utility function that takes a dayjs date object and floors its minutes to the
// nearest multiple of 5, resetting seconds and milliseconds to zero for
// consistent time rounding.

import dayjs from 'dayjs';

export default function floorTo15(date: dayjs.Dayjs) {
  const minutes = date.minute();
  const floored = Math.floor(minutes / 15) * 15;

  return date.minute(floored).second(0).millisecond(0);
}
