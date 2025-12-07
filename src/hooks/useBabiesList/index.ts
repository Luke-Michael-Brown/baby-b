import { useQuery } from '@tanstack/react-query'
import useGoogleAPI from '../useGoogleAPI'

export default function useBabiesList() {
  const { fetchJsonFromDrive } = useGoogleAPI()

  return useQuery({
    queryKey: ['babies-data'],
    queryFn: () => fetchJsonFromDrive(),
    select: data => Object.keys(data).filter(babyName => data[babyName].isShown),
  })
}
