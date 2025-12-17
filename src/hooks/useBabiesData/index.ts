import { useQuery } from '@tanstack/react-query';

import useGoogleAPI from '../useGoogleAPI';
import type { BabiesData } from '../../types';

export default function useBabiesData() {
  const { fetchJsonFromDrive } = useGoogleAPI();

  return useQuery<BabiesData>({
    queryKey: ['babies-data'],
    queryFn: () => fetchJsonFromDrive(),
  });
}
