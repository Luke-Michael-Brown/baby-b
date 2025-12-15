import { useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';

import useGoogleAPI from '../../hooks/useGoogleAPI';

import type { Entry } from '../useBabyTabData';

export default function useEditEntry() {
  const qc = useQueryClient();
  const { uploadJsonToDrive, fetchJsonFromDrive } = useGoogleAPI();

  return async (
    editId: string,
    babyName: string,
    tab: string,
    data: Record<string, string | number | boolean | undefined | Dayjs | null>,
  ) => {
    const babiesData = await fetchJsonFromDrive();

    const editIndex = babiesData[babyName][tab].findIndex(
      (entry: Entry) => entry.id === editId,
    );
    if (editIndex === -1) return;

    babiesData[babyName][tab][editIndex] = {
      ...babiesData[babyName][tab][editIndex],
      ...data,
      timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    };
    await uploadJsonToDrive(babiesData);
    await qc.invalidateQueries({ queryKey: ['babies-data'], exact: true });
  };
}
