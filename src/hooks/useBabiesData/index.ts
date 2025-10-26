import { useQuery } from '@tanstack/react-query';
import useGoogleAPI from '../useGoogleAPI';

export default function useBabiesData() {
	const { fetchCsvFromDrive } = useGoogleAPI();

	return useQuery({
		queryKey: ['babies-data'],
		queryFn: () => fetchCsvFromDrive()
	})
}
