import { useQuery } from '@tanstack/react-query';

import { useGoogleFileAPI } from '../useGoogleAPI';

export default function useBabiesList() {
  const { fetchJsonFromDrive } = useGoogleFileAPI({
    filePath: import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_NAME!,
  });

  return useQuery({
    queryKey: ['babies-data'],
    queryFn: () => fetchJsonFromDrive(),
    select: data =>
      Object.keys(data).filter(babyName => data[babyName].isShown),
  });
}
