import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import useGoogleAPI from "../../hooks/useGoogleAPI";

export default function useEditEntry() {
  const qc = useQueryClient();
  const { uploadJsonToDrive, fetchJsonFromDrive } = useGoogleAPI();

  return async (editId: string, babyName: string, tab: string, data: Record<string, any>) => {
    const babiesData = await fetchJsonFromDrive();

    const editIndex = babiesData[babyName][tab].findIndex((entry: any) => entry.id === editId);
    if (editIndex === -1) return;

    babiesData[babyName][tab][editIndex] = {
      ...data,
      babyName,
      isShown: true,
      timestamp: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      id: crypto.randomUUID(),
    };
    await uploadJsonToDrive(babiesData);
    await qc.invalidateQueries({ queryKey: ["babies-data"], exact: true });
  }
}
