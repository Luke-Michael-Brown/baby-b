import { useAtomValue } from 'jotai';
import { Dayjs } from 'dayjs';

import selectedBabyAtom from '../../atoms/selectedBabyAtom';
import {
  summayStartDateAtom,
  summaryEndDateAtom,
} from '../../atoms/summaryDatesAtom';
import config from '../../config';
import useBabiesData from '../useBabiesData';

interface Props {
  tab: string;
}

export default ({ tab }: Props): string[] => {
  const selectedBaby = useAtomValue(selectedBabyAtom);
  const startDate: Dayjs = useAtomValue(summayStartDateAtom);
  const endDate: Dayjs = useAtomValue(summaryEndDateAtom);

  const { data: babiesData } = useBabiesData();
  const data = selectedBaby ? babiesData?.[selectedBaby] : undefined;
  const tabConfig = config[tab];

  return data ? (tabConfig.getSummary?.(data, startDate, endDate) ?? []) : [];
};
