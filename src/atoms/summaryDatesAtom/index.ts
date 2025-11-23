import { atom } from "jotai";
import dayjs, { Dayjs } from "dayjs";

export const summayStartDateAtom = atom<Dayjs>(dayjs().subtract(7, "day"));
export const summaryEndDateAtom = atom<Dayjs>(dayjs());

export default {
  summayStartDateAtom,
  summaryEndDateAtom,
};
