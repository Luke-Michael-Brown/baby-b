import { useQuery } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import useGoogleAPI from '../useGoogleAPI';
import selectedTabAtom, { TABS } from '../../atoms/selectedTabAtom';
import selectedBabyAtom from '../../atoms/selectedBabyAtom';

export default function useBabyTabData() {
	const { fetchCsvFromDrive } = useGoogleAPI();
	const selectedTab = useAtomValue(selectedTabAtom);
	const tab = TABS[selectedTab];
	const selectedBaby = useAtomValue(selectedBabyAtom);

	return useQuery({
		queryKey: ['babies-data'],
		queryFn: () => fetchCsvFromDrive(),
		select: (data) => data[selectedBaby][tab].filter((entry) => entry.isShown).map((entry) => ({
			...entry,
			start_time: new Date(entry.start_time).toLocaleString(),
			end_time: new Date(entry.end_time).toLocaleString(),
		}))
	})
}
