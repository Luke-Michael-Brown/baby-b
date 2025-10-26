import { useQuery } from '@tanstack/react-query';
import useGoogleAPI from '../useGoogleAPI';

export default function useBabiesList() {
	const { fetchCsvFromDrive } = useGoogleAPI();

	return useQuery({
		queryKey: ['babies-data'],
		queryFn: () => fetchCsvFromDrive(),
		select: (data) => Object.keys(data).filter((babyName) => data[babyName].isShown),
	})
}
