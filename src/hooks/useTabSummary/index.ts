import { useAtomValue } from "jotai";
import { TAB_TO_SUMMARY_DATA } from "../../atoms/selectedTabAtom";
import {
  summayStartDateAtom,
  summaryEndDateAtom,
} from "../../atoms/summaryDatesAtom";
import useBabyTabData from "../../hooks/useBabyTabData";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  tab: string;
}

export default ({ tab }: Props): string[] => {
  const startDate: Dayjs = useAtomValue(summayStartDateAtom);
  const endDate: Dayjs = useAtomValue(summaryEndDateAtom);

  const { data: tabData } = useBabyTabData({ overrideTab: tab });
  const getSummary = TAB_TO_SUMMARY_DATA[tab];

  if (!tabData || !getSummary) return ["No data yet"];

  // Filter data by date range using Dayjs
  const filteredData = tabData.filter((item: any) => {
    const itemDate = dayjs(item.startTime || item.date || item.timestamp);
    return (
      itemDate.isSame(startDate) ||
      itemDate.isSame(endDate) ||
      (itemDate.isAfter(startDate) && itemDate.isBefore(endDate))
    );
  });

  if (filteredData.length === 0) return ["No data in range"];

  return getSummary(filteredData, { startDate, endDate });
};
