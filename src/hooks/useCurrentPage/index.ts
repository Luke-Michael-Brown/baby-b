import { useAtomValue } from 'jotai';

import selectedBabyAtom from '../../atoms/selectedBabyAtom';
import useGoogleAPI from '../useGoogleAPI';

export type Page = 'login' | 'loading' | 'content';

export default function useCurrentPage() {
  const { isSignedIn } = useGoogleAPI();
  const selectedBaby = useAtomValue(selectedBabyAtom);

  if (!isSignedIn) {
    return 'login' as Page;
  }

  if (!selectedBaby) {
    return 'loading' as Page;
  }

  return 'content' as Page;
}
