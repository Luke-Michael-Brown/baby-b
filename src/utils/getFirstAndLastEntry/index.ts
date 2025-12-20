import dayjs from 'dayjs';
import type { Entry } from '../../types';

export default function getFirstAndLastEntry(tabData: Entry[]): {
  firstEntry: Entry | null;
  latestEntry: Entry | null;
} {
  let firstEntry: Entry | null = null;
  let latestEntry: Entry | null = null;
  tabData.forEach(entry => {
    if (!entry.isShown) return;

    if (
      !latestEntry ||
      dayjs(latestEntry.start_time).isBefore(dayjs(entry.start_time))
    ) {
      latestEntry = entry;
    }
    if (
      !firstEntry ||
      dayjs(firstEntry.start_time).isAfter(dayjs(entry.start_time))
    ) {
      firstEntry = entry;
    }
  });

  return { firstEntry, latestEntry };
}
