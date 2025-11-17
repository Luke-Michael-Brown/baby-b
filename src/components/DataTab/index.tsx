import { useAtomValue } from "jotai";
import { DataGrid } from "@mui/x-data-grid";
import useBabyTabData from "../../hooks/useBabyTabData";
import selectedTabAtom, { TABS, COLUMNS } from "../../atoms/selectedTabAtom";

const paginationModel = { page: 0, pageSize: 10 };

function DataTab() {
	const selectedTab = useAtomValue(selectedTabAtom);
	const tab = TABS[selectedTab];
	const { data: tabData } = useBabyTabData();

	const columns = COLUMNS[tab];
	return columns ? (
		<DataGrid
			rows={tabData}
			columns={columns}
			initialState={{ pagination: { paginationModel } }}
			sx={{ border: 0 }}
		/>
	) : null;
}

export default DataTab;
