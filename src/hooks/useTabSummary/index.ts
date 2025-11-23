import { TAB_TO_SUMMARY_DATA } from '../../atoms/selectedTabAtom';
import useBabyTabData from '../../hooks/useBabyTabData';

interface Props {
  tab: string;
  startDate: Date;
  endDate: Date;
}

export default ({ tab, startDate, endDate }: Props): string[] => {
  const { data: tabData } = useBabyTabData({ overrideTab: tab });
  const getSummary = TAB_TO_SUMMARY_DATA[tab];

  if (!tabData || !getSummary) return ['No data yet'];

  // Filter data by date range
  const filteredData = tabData.filter((item: any) => {
    const itemDate = new Date(item.startTime || item.date || item.timestamp);
    return itemDate >= startDate && itemDate <= endDate;
  });

  if (filteredData.length === 0) return ['No data in range'];

  return getSummary(filteredData, { startDate, endDate });
};
