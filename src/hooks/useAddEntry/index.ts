// Custom hook for adding new entries to the data.

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';

import { useGoogleFileAPI } from '../../hooks/useGoogleAPI';

export default function useAddEntry() {
  const qc = useQueryClient();
  const { uploadJsonToDrive, fetchJsonFromDrive } = useGoogleFileAPI({
    filePath: import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_NAME!,
  });

  return useCallback(
    async (
      babyName: string,
      tab: string,
      data: Record<
        string,
        string | number | boolean | undefined | Dayjs | null
      >,
    ) => {
      const babiesData = await fetchJsonFromDrive();

      if (!babiesData[babyName][tab]) {
        babiesData[babyName][tab] = [];
      }

      babiesData[babyName][tab].unshift({
        ...data,
        babyName,
        isShown: true,
        timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        id: crypto.randomUUID(),
      });
      await uploadJsonToDrive(babiesData);
      await qc.invalidateQueries({ queryKey: ['babies-data'], exact: true });
    },
    [qc, uploadJsonToDrive, fetchJsonFromDrive],
  );
}
