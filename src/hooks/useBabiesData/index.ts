import { useQuery } from '@tanstack/react-query';
import useGoogleAPI from '../useGoogleAPI';

export default function useBabiesData() {
	const { fetchJsonFromDrive } = useGoogleAPI();

	return useQuery({
		queryKey: ['babies-data'],
		queryFn: () => fetchJsonFromDrive()
	})
}
