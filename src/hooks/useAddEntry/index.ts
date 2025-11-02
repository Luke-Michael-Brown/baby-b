import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";
import useBabiesData from "../../hooks/useBabiesData";
import useGoogleAPI from "../../hooks/useGoogleAPI";

export default function useAddEntry() {
  const qc = useQueryClient();
  const { data: babiesData } = useBabiesData();
  const { uploadJsonToDrive } = useGoogleAPI();

  return async (babyName: string, tab: string, data: Record<string, any>) => {
    babiesData[babyName][tab].unshift({
      ...data,
      babyName,
      isShown: true,
      timestamp: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      id: crypto.randomUUID(),
    });
    await uploadJsonToDrive(babiesData);
    await qc.invalidateQueries({ queryKey: ["babies-data"], exact: true });
  }
}
