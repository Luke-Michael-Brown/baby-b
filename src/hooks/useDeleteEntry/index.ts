import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import useGoogleAPI from "../../hooks/useGoogleAPI";

export default function useDeleteEntry() {
  const qc = useQueryClient();
  const { uploadJsonToDrive, fetchJsonFromDrive } = useGoogleAPI();

  return async (deleteId: string, babyName: string, tab: string) => {
    const babiesData = await fetchJsonFromDrive();

    const deleteIndex = babiesData[babyName][tab].findIndex((entry: any) => entry.id === deleteId);
    if (deleteIndex === -1) return;

    babiesData[babyName][tab][deleteIndex] = {
      ...babiesData[babyName][tab][deleteIndex],
      isShown: false,
      timestamp: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
    };
    await uploadJsonToDrive(babiesData);
    await qc.invalidateQueries({ queryKey: ["babies-data"], exact: true });
  }
}
