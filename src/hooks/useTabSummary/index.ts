import { TAB_TO_SUMMARY_DATA } from '../../atoms/selectedTabAtom';
import type { RangeOption } from '../../atoms/selectedTabAtom';
import useBabyTabData from '../../hooks/useBabyTabData';

interface Props {
  tab: string;
  range: RangeOption
}

export default ({ tab, range }: Props): string[] => {
  const { data: tabData } = useBabyTabData({ overrideTab: tab });
  const getSummary = TAB_TO_SUMMARY_DATA[tab];
  if (getSummary && tabData) {
    return getSummary(tabData, range);
  }
  return ['No data tet']
}