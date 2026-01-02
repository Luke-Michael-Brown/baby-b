import { useQuery } from '@tanstack/react-query';

import type { BabiesData } from '../../types';
import { useGoogleFileAPI } from '../useGoogleAPI';

export default function useBabiesData() {
  const { fetchJsonFromDrive } = useGoogleFileAPI({
    filePath: import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_NAME!,
  });

  return useQuery<BabiesData>({
    queryKey: ['babies-data'],
    queryFn: () => fetchJsonFromDrive(),
  });
}
