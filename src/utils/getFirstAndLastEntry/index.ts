// Helper for getting the first ever entry and last entry ever for a given entry
// Also provides timeAgo which represents the num of hours and mins between now and latest entry

import dayjs from 'dayjs';
import type { Entry } from '../../types';

export default function getFirstAndLastEntry(tabData: Entry[]): {
  firstEntry: Entry | null;
  latestEntry: Entry | null;
  timeAgo: string | null;
} {
  let firstEntry: Entry | null = null;
  let latestEntry: Entry | null = null;

  tabData.forEach(entry => {
    if (!entry.isShown) return;

    const entryTime = dayjs(entry.start_time);

    if (!latestEntry || dayjs(latestEntry.start_time).isBefore(entryTime)) {
      latestEntry = entry;
    }
    if (!firstEntry || dayjs(firstEntry.start_time).isAfter(entryTime)) {
      firstEntry = entry;
    }
  });

  let timeAgo: string | null = null;

  if (latestEntry) {
    const diffInMinutes = dayjs().diff(
      dayjs((latestEntry as Entry).start_time),
      'minute',
    );

    // Calculate hours and the remaining minutes
    const h = Math.floor(diffInMinutes / 60);
    const m = diffInMinutes % 60;

    timeAgo = h > 0 ? `${h}h ${m}m` : `${m}m`;
  }

  return { firstEntry, latestEntry, timeAgo };
}
