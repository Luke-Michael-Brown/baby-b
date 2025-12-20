import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import config from '../../config';
import type { BabyData } from '../../types';

export default function getAverages(
  data: BabyData | undefined,
  tabs: string[],
  startDate: Dayjs,
  endDate: Dayjs,
  fieldToAverage: string,
  filters?: { [key: string]: (string | number | boolean)[] },
): {
  average: number;
  daysAverage: number;
  averagePerDay: number;
} | null {
  if (!data) return null;

  const uniqueDays = new Set<string>();
  let count = 0;
  let total = 0;

  Object.keys(data).forEach(tab => {
    const tabConfig = config[tab];
    if (!tabs.includes(tab) || !tabConfig.fields) {
      return;
    }
    data[tab].forEach(entry => {
      const itemDate = dayjs(entry.start_time);

      const isInRange =
        itemDate.isSame(startDate, 'day') ||
        itemDate.isSame(endDate, 'day') ||
        (itemDate.isAfter(startDate) && itemDate.isBefore(endDate));

      const matchesFilters = filters
        ? Object.entries(filters).every(([key, values]) =>
            values.some(value => entry[key] === value),
          )
        : true;

      if (!entry.isShown || !isInRange || !matchesFilters) {
        return;
      }

      count += 1;
      uniqueDays.add(itemDate.format('YYYY-MM-DD'));

      if (fieldToAverage === 'duration') {
        const start = new Date(entry.start_time);
        const end = new Date(entry.end_time ?? start);
        total += end.getTime() - start.getTime();
      } else if (fieldToAverage) {
        const value = entry[fieldToAverage];
        if (typeof value === 'number' || typeof value === 'string') {
          total += parseFloat(value as string);
        } else if (value === true) {
          total += 1;
        }
      } else {
        total += 1;
      }
    });
  });

  if (count === 0) return null;

  return {
    average: Math.round((total / count) * 100) / 100,
    daysAverage: Math.round((total / uniqueDays.size) * 100) / 100,
    averagePerDay: Math.round((count / uniqueDays.size) * 100) / 100,
  };
}
