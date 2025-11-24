import { atom } from "jotai";
import dayjs, { Dayjs } from "dayjs";

export const summayStartDateAtom = atom<Dayjs>(dayjs().subtract(8, "day"));
export const summaryEndDateAtom = atom<Dayjs>(dayjs().subtract(1, "day"));

export default {
  summayStartDateAtom,
  summaryEndDateAtom,
};
