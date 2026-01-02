// This file defines Jotai atoms that manage the date range used for summary
// calculations in the baby tracking application.
// It includes atoms for the start and end dates, initialized to cover the past
// week by default (from 8 days ago to yesterday).
// These atoms allow components to control and subscribe to changes in the
// summary period, enabling dynamic data aggregation and display based on
// user-selected date ranges.

import { atom } from 'jotai';
import dayjs, { Dayjs } from 'dayjs';

export const summayStartDateAtom = atom<Dayjs>(
  dayjs().startOf('day').subtract(7, 'day'),
);
export const summaryEndDateAtom = atom<Dayjs>(
  dayjs().endOf('day').subtract(1, 'day'),
);

export default {
  summayStartDateAtom,
  summaryEndDateAtom,
};
