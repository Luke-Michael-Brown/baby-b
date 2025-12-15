import { useAtomValue } from 'jotai';
import {
  summayStartDateAtom,
  summaryEndDateAtom,
} from '../../atoms/summaryDatesAtom';
import useBabyTabData from '../../hooks/useBabyTabData';
import { Dayjs } from 'dayjs';
import getTabSummary from '../../utils/getTabSummary';

interface Props {
  tab: string;
}

export default ({ tab }: Props): string[] => {
  const startDate: Dayjs = useAtomValue(summayStartDateAtom);
  const endDate: Dayjs = useAtomValue(summaryEndDateAtom);

  const { data: tabData } = useBabyTabData({ overrideTab: tab });
  return getTabSummary(tabData, tab, startDate, endDate);
};
