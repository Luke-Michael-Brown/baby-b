import { TAB_TO_SUMMARY_DATA } from '../../atoms/selectedTabAtom';
import useBabyTabData from '../../hooks/useBabyTabData';

interface Props {
  tab: string;
  range: string
}

export default ({ tab, range }: Props): string[] => {
  const { data: tabData } = useBabyTabData({ overrideTab: tab });
  return TAB_TO_SUMMARY_DATA[tab](tabData, range);
}