import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

import { useGoogleFileAPI } from '../../hooks/useGoogleAPI';
import type { Entry } from '../../types';

export default function useDeleteEntry() {
  const qc = useQueryClient();
  const { uploadJsonToDrive, fetchJsonFromDrive } = useGoogleFileAPI({
    filePath: import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_NAME!,
  });

  return async (deleteId: string, babyName: string, tab: string) => {
    const babiesData = await fetchJsonFromDrive();

    const deleteIndex = babiesData[babyName][tab].findIndex(
      (entry: Entry) => entry.id === deleteId,
    );
    if (deleteIndex === -1) return;

    babiesData[babyName][tab][deleteIndex] = {
      ...babiesData[babyName][tab][deleteIndex],
      isShown: false,
      timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    };
    await uploadJsonToDrive(babiesData);
    await qc.invalidateQueries({ queryKey: ['babies-data'], exact: true });
  };
}
