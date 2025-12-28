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

    // 1. Over a week (10080 minutes) -> xw yd
    if (diffInMinutes >= 10080) {
      const weeks = Math.floor(diffInMinutes / 10080);
      const remainingDays = Math.floor((diffInMinutes % 10080) / 1440);
      timeAgo = `${weeks}w ${remainingDays}d ago`;
    }
    // 2. Over 24 hours (1440 minutes) -> xd yh
    else if (diffInMinutes >= 1440) {
      const days = Math.floor(diffInMinutes / 1440);
      const remainingHours = Math.floor((diffInMinutes % 1440) / 60);
      timeAgo = `${days}d ${remainingHours}h ago`;
    }
    // 3. Under 24 hours -> xh ym
    else {
      const hours = Math.floor(diffInMinutes / 60);
      const minutes = diffInMinutes % 60;
      timeAgo = hours > 0 ? `${hours}h ${minutes}m ago` : `${minutes}m ago`;
    }
  }

  return { firstEntry, latestEntry, timeAgo };
}
