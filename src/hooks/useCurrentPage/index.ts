import { useAtomValue } from 'jotai';

import selectedBabyAtom from '../../atoms/selectedBabyAtom';
import useBabiesList from '../useBabiesList';
import useGoogleAPI from '../useGoogleAPI';

export type Page = 'login' | 'loading' | 'content';

export default function useCurrentPage() {
  const { isSignedIn } = useGoogleAPI();
  const { isLoading } = useBabiesList();
  const selectedBaby = useAtomValue(selectedBabyAtom);

  if (!isSignedIn) {
    return 'login' as Page;
  }

  if (isLoading || !selectedBaby) {
    return 'loading' as Page;
  }

  return 'content' as Page;
}
