import dayjs from 'dayjs';

import type { Dayjs } from 'dayjs';
import config from '../../config';
import type { Entry } from '../../hooks/useBabyTabData';
import formatMsToMinSec from '../formatMsToMinSec';

export default function getTabSummary(
  tabData: Entry[] | undefined,
  tab: string,
  startDate: Dayjs,
  endDate: Dayjs,
): string[] {
  if (!tabData) return ['No data yet'];

  const tabConfig = config[tab];
  const filteredData = tabData.filter((item: Entry) => {
    const itemDate = dayjs(item.start_time);
    return (
      itemDate.isSame(startDate, 'day') ||
      itemDate.isSame(endDate, 'day') ||
      (itemDate.isAfter(startDate) && itemDate.isBefore(endDate))
    );
  });

  if (filteredData.length === 0) return ['No data in range'];

  const uniqueDays = new Set<string>();
  const totals = new Array(tabConfig.summayItems?.length || 0).fill(0);

  filteredData.forEach(entry => {
    const localDay = dayjs(entry.start_time).format('YYYY-MM-DD');
    uniqueDays.add(localDay);

    tabConfig.summayItems?.forEach(({ fieldToAverage, filters }, index) => {
      if (filters) {
        const matchesFilters = Object.entries(filters).every(([key, values]) =>
          values.some(value => entry[key] === value),
        );
        if (!matchesFilters) return;
      }

      if (fieldToAverage === 'duration') {
        const start = new Date(entry.start_time);
        const end = new Date(entry.end_time ?? start);
        const durationMs = end.getTime() - start.getTime();
        totals[index] += durationMs;
      } else if (fieldToAverage) {
        const value = entry[fieldToAverage];
        if (typeof value === 'number' || typeof value === 'string') {
          totals[index] += parseFloat(value as string);
        } else if (value === true) {
          totals[index] += 1;
        }
      } else {
        totals[index] += 1;
      }
    });
  });

  const numberOfDays = uniqueDays.size;
  return (
    tabConfig.summayItems?.map((summaryItem, index) => {
      const isDaysPeriod = summaryItem.peroid === 'days';

      const units = summaryItem.fieldToAverage
        ? (tabConfig.fields?.find(
            f => f.columnFields.field === summaryItem.fieldToAverage,
          )?.fullName ?? '')
        : '';

      const average = isDaysPeriod
        ? numberOfDays > 0
          ? totals[index] / numberOfDays
          : 0
        : totals[index] / filteredData.length;

      const formattedAverage =
        summaryItem.fieldToAverage === 'duration'
          ? formatMsToMinSec(average)
          : `${average.toFixed(2)} ${units}`;

      const whatIsAveraged = summaryItem.filters
        ? Object.entries(summaryItem.filters)
            .map(([key, values]) => {
              if (typeof values[0] === 'boolean') {
                return `${
                  tabConfig.fields
                    ?.find(f => f.columnFields.field === key)
                    ?.fullName?.toLowerCase() ?? key
                }(s)`;
              }

              return `${values[0].toString().toLowerCase()}(s)`;
            })
            .join(', ')
        : summaryItem.fieldToAverage
          ? ''
          : `${tab}s`;

      const peroidText = isDaysPeriod ? 'day' : tab;

      return `Averages ${formattedAverage} ${whatIsAveraged} per ${peroidText}`;
    }) ?? []
  );
}
