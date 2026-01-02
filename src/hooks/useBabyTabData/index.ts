import { useAtomValue } from 'jotai';
import { useQuery } from '@tanstack/react-query';

import selectedBabyAtom from '../../atoms/selectedBabyAtom';
import selectedTabAtom from '../../atoms/selectedTabAtom';
import type { BabiesData, Entry } from '../../types';
import { useGoogleFileAPI } from '../useGoogleAPI';

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
};

interface Props {
  overrideTab?: string;
}

export default function useBabyTabData({ overrideTab }: Props = {}) {
  const { fetchJsonFromDrive } = useGoogleFileAPI({
    filePath: import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_NAME!,
  });
  const { tab } = useAtomValue(selectedTabAtom);
  const selectedBaby = useAtomValue(selectedBabyAtom);

  return useQuery({
    queryKey: ['babies-data'],
    queryFn: () => fetchJsonFromDrive() as Promise<BabiesData>,
    select: (data: BabiesData) => {
      if (!selectedBaby || !data[selectedBaby]) return [];

      const entries = data[selectedBaby]?.[overrideTab ?? tab] ?? [];

      return entries
        .filter((entry: Entry) => entry.isShown)
        .sort(
          (a: Entry, b: Entry) =>
            new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
        )
        .map((entry: Entry) => ({
          ...entry,
          start_time: new Date(entry.start_time).toLocaleString(
            'en-US',
            DATE_OPTIONS,
          ),
          end_time: entry.end_time
            ? new Date(entry.end_time).toLocaleString('en-US', DATE_OPTIONS)
            : undefined,
        }));
    },
  });
}
