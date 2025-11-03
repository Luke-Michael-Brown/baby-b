import { useAtomValue } from 'jotai'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import useBabyTabData from '../../hooks/useBabyTabData';
import selectedTabAtom, { TABS, COLUMNS } from '../../atoms/selectedTabAtom';

const paginationModel = { page: 0, pageSize: 5 };

function DataTab() {
	const selectedTab = useAtomValue(selectedTabAtom);
	const tab = TABS[selectedTab];
	const { data: tabData, error } = useBabyTabData();

	return (
    <Box sx={{ flexGrow: 1, px: 1, py: 1 }}>
			<Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
	      <DataGrid
	        rows={tabData}
	        columns={COLUMNS[tab]}
	        initialState={{ pagination: { paginationModel } }}
	        pageSizeOptions={[5, 10]}
	        sx={{ border: 0 }}
	      />
			</Typography>
		</Box>
	);
}

export default DataTab;
