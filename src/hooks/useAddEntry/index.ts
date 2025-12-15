import { useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';

import useGoogleAPI from '../../hooks/useGoogleAPI';

export default function useAddEntry() {
  const qc = useQueryClient();
  const { uploadJsonToDrive, fetchJsonFromDrive } = useGoogleAPI();

  return async (
    babyName: string,
    tab: string,
    data: Record<string, string | number | boolean | undefined | Dayjs | null>,
  ) => {
    const babiesData = await fetchJsonFromDrive();

    babiesData[babyName][tab].unshift({
      ...data,
      babyName,
      isShown: true,
      timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      id: crypto.randomUUID(),
    });
    await uploadJsonToDrive(babiesData);
    await qc.invalidateQueries({ queryKey: ['babies-data'], exact: true });
  };
}
