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
    const now = dayjs();
    const start = dayjs((latestEntry as Entry).start_time);
    const diffInMinutes = now.diff(start, 'minute');

    // 1. If more than 24 hours (1440 minutes)
    if (diffInMinutes >= 1440) {
      const days = Math.floor(diffInMinutes / 1440);
      timeAgo = days === 1 ? '1 day ago' : `${days} days ago`;
    }
    // 2. If under 24 hours, show h/m
    else {
      const h = Math.floor(diffInMinutes / 60);
      const m = diffInMinutes % 60;
      timeAgo = h > 0 ? `${h}h ${m}m ago` : `${m}m ago`;
    }
  }

  return { firstEntry, latestEntry, timeAgo };
}
