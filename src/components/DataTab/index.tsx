import { useAtomValue } from "jotai";
import { DataGrid } from "@mui/x-data-grid";
import useBabyTabData from "../../hooks/useBabyTabData";
import selectedTabAtom, { TABS, COLUMNS } from "../../atoms/selectedTabAtom";

const paginationModel = { page: 0, pageSize: 10 };

function DataTab() {
	const selectedTab = useAtomValue(selectedTabAtom);
	const tab = TABS[selectedTab];
	const { data: tabData, error } = useBabyTabData();

	return (
		<DataGrid
			rows={tabData}
			columns={COLUMNS[tab]}
			initialState={{ pagination: { paginationModel } }}
			pageSizeOptions={[5, 10]}
			sx={{ border: 0 }}
		/>
	);
}

export default DataTab;
