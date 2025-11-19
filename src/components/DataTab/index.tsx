import { useMemo, useState } from "react";
import { useAtomValue } from "jotai";

import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import useBabyTabData from "../../hooks/useBabyTabData";
import selectedTabAtom, { TABS, COLUMNS } from "../../atoms/selectedTabAtom";
import EntryDialog, { DEFAULT_ENTRY_DIALOG_PROPS } from "../EntryDialog";

const paginationModel = { page: 0, pageSize: 50 };

function DataTab() {
	const selectedTab = useAtomValue(selectedTabAtom);
	const tab = TABS[selectedTab];
	const { data: tabData } = useBabyTabData();

	const [entryDialogProps, setEntryDialogProps] = useState<EntryDialogProps>(
		DEFAULT_ENTRY_DIALOG_PROPS,
	);

	const columns = useMemo(() => {
		return COLUMNS[tab].concat([
			{
				field: "actions",
				type: "actions",
				headerName: "Actions",
				getActions: (params) => [
					<GridActionsCellItem
						icon={<EditIcon />}
						label="Edit"
						onClick={(e) => {
							e.stopPropagation();
							setEntryDialogProps({
								tab,
								open: true,
								editId: params.row.id,
								handleClose: () =>
									setEntryDialogProps((oldProps) => ({
										...oldProps,
										open: false,
									})),
							});
						}}
					/>,
					// <GridActionsCellItem
					// 	icon={<DeleteIcon />}
					// 	label="Delete"
					// 	onClick={(e) => {
					// 		e.stopPropagation();
					// 		console.log("Delete row", params.row);
					// 	}}
					// />,
				],
			},
		]);
	}, [tab]);
	return columns ? (
		<>
			<DataGrid
				rows={tabData}
				columns={columns}
				initialState={{ pagination: { paginationModel } }}
				sx={{ border: 0 }}
			/>
			<EntryDialog {...entryDialogProps} />
		</>
	) : null;
}

export default DataTab;
