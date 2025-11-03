import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import useGoogleAPI from '../useGoogleAPI';
import selectedTabAtom, { TABS } from '../../atoms/selectedTabAtom';
import selectedBabyAtom from '../../atoms/selectedBabyAtom';

const DATE_OPTIONS = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: undefined,
  hour12: true,
};

interface Props {
  overrideTab?: string;
}

export default function useBabyTabData({ overrideTab }: Props = {}) {
  const { fetchJsonFromDrive } = useGoogleAPI();
  const selectedTab = useAtomValue(selectedTabAtom);
  const tab = overrideTab ?? TABS[selectedTab];
  const selectedBaby = useAtomValue(selectedBabyAtom);

  return useQuery({
    queryKey: ['babies-data'],
    queryFn: () => fetchJsonFromDrive(),
    select: (data) => {
      const entries = data[selectedBaby]?.[tab] || [];
      return entries
        .filter((entry) => entry.isShown)
        .sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime())
        .map((entry) => ({
          ...entry,
          start_time: new Date(entry.start_time).toLocaleString('en-US', DATE_OPTIONS),
          end_time: new Date(entry.end_time).toLocaleString('en-US', DATE_OPTIONS),
        }));
    },
  });
}
