import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import config from '../../config';
import type { BabyData, Entry } from '../../types';
import formatMsToMinSec from '../formatMsToMinSec';
import gramsToLB from '../gramsToLB';
import mlToOz from '../mlToOz';
import inchesToFootInches from '../inchesToFootInches';

export default function getTabSummary(
  data: BabyData | undefined,
  tab: string,
  startDate: Dayjs,
  endDate: Dayjs,
): string[] {
  if (!data) return ['No data yet'];

  const tabData = data[tab];
  if (!tabData || tabData.length === 0) return ['No data yet'];

  const tabConfig = config[tab];

  // Filter data by date for averages
  const dateFilteredData = tabData.filter((item: Entry) => {
    const itemDate = dayjs(item.start_time);
    return (
      itemDate.isSame(startDate, 'day') ||
      itemDate.isSame(endDate, 'day') ||
      (itemDate.isAfter(startDate) && itemDate.isBefore(endDate))
    );
  });

  const uniqueDays = new Set<string>();
  const totals = new Array(tabConfig.summayItems?.length || 0).fill(0);

  dateFilteredData.forEach(entry => {
    uniqueDays.add(dayjs(entry.start_time).format('YYYY-MM-DD'));

    tabConfig.summayItems?.forEach(
      ({ fieldToSummarize, filters, summaryType }, index) => {
        // Skip global-only summary types
        if (summaryType === 'latestValue' || summaryType === 'firstValue')
          return;

        if (filters) {
          const matchesFilters = Object.entries(filters).every(
            ([key, values]) => values.some(value => entry[key] === value),
          );
          if (!matchesFilters) return;
        }

        if (fieldToSummarize === 'duration') {
          const start = new Date(entry.start_time);
          const end = new Date(entry.end_time ?? start);
          totals[index] += end.getTime() - start.getTime();
        } else if (fieldToSummarize) {
          const value = entry[fieldToSummarize];
          if (typeof value === 'number' || typeof value === 'string') {
            totals[index] += parseFloat(value as string);
          } else if (value === true) {
            totals[index] += 1;
          }
        } else {
          totals[index] += 1;
        }
      },
    );
  });

  const hasRangeData = dateFilteredData.length > 0;

  // Helper to format value with units and rounding
  const formatWithUnits = (
    field: string | undefined,
    value: string | number | boolean | undefined | null,
  ) => {
    if (value === undefined || value === null) return '';

    let formattedValue: string;
    if (field === 'duration') {
      formattedValue = formatMsToMinSec(Number(value));
    } else if (typeof value === 'boolean') {
      formattedValue = value ? 'Yes' : 'No';
    } else if (field === 'start_time') {
      formattedValue = new Date(value).toLocaleString();
    } else if (!isNaN(Number(value))) {
      formattedValue = Number(value).toFixed(2);
    } else {
      formattedValue = value.toString();
    }

    // Lookup unit from config
    const unit =
      field &&
      tabConfig.fields?.find(f => f.columnFields.field === field)?.fullName;

    if (unit === 'mL') {
      return `${formattedValue} ${unit} (${mlToOz(Number(value)).toFixed(2)} oz)`;
    } else if (unit === 'grams') {
      return `${formattedValue} ${unit} (${gramsToLB(Number(value))})`;
    } else if (unit === '\"') {
      return `${formattedValue} ${unit} (${inchesToFootInches(Number(value))})`;
    } else if (unit && unit !== 'duration') {
      return `${formattedValue} ${unit}`;
    }

    return formattedValue;
  };

  return (
    tabConfig.summayItems?.map((summaryItem, index) => {
      const { summaryType, fieldToSummarize, filters } = summaryItem;

      /** ---------- FIRST / LATEST (GLOBAL) ---------- */
      if (summaryType === 'latestValue' || summaryType === 'firstValue') {
        if (!fieldToSummarize) return '—';

        const filteredAllData = tabData
          .filter(entry =>
            filters
              ? Object.entries(filters).every(([key, values]) =>
                  values.some(v => entry[key] === v),
                )
              : true,
          )
          .sort((a, b) =>
            summaryType === 'latestValue'
              ? dayjs(b.start_time).valueOf() - dayjs(a.start_time).valueOf()
              : dayjs(a.start_time).valueOf() - dayjs(b.start_time).valueOf(),
          );

        const entry = filteredAllData[0];
        if (!entry) return 'No data';

        const value =
          fieldToSummarize === 'duration'
            ? new Date(entry.end_time ?? entry.start_time).getTime() -
              new Date(entry.start_time).getTime()
            : entry[fieldToSummarize];

        return `${summaryType === 'latestValue' ? 'Latest' : 'First'}: ${formatWithUnits(
          fieldToSummarize,
          value,
        )}`;
      }

      /** ---------- AVERAGES (RANGE-BASED) ---------- */
      if (!hasRangeData) {
        return 'No data in range';
      }

      const isDaysPeriod = summaryType === 'daysAverage';
      const average = isDaysPeriod
        ? uniqueDays.size > 0
          ? totals[index] / uniqueDays.size
          : 0
        : totals[index] / dateFilteredData.length;

      return `Averages ${formatWithUnits(fieldToSummarize, average)} per ${
        isDaysPeriod ? 'day' : tab
      }`;
    }) ?? []
  );
}
