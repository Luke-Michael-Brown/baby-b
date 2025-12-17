import { useQuery } from '@tanstack/react-query';

import type { BabiesData } from '../../types';
import useGoogleAPI from '../useGoogleAPI';

export default function useBabiesData() {
  const { fetchJsonFromDrive } = useGoogleAPI();

  return useQuery<BabiesData>({
    queryKey: ['babies-data'],
    queryFn: () => fetchJsonFromDrive(),
  });
}
