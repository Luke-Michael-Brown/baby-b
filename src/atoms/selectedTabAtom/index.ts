import { atom } from "jotai";

export const COLUMNS = {
	sleep: [
		{ minWidth: 175, field: "start_time", headerName: "Start Time" },
		{ minWidth: 175, field: "end_time", headerName: "End Time" },
		{ minWidth: 100, field: "extra1", headerName: "Type" },
	],
	diaper: [
		{ minWidth: 175, field: "start_time", headerName: "Start Time" },
		{ minWidth: 175, field: "extra1", headerName: "Type" },
	],
	nursing: [
		{ minWidth: 175, field: "start_time", headerName: "Start Time" },
		{ minWidth: 175, field: "end_time", headerName: "End Time" },
		{ minWidth: 100, field: "extra1", headerName: "Left or Right" },
	],
	bottle: [
		{ minWidth: 175, field: "start_time", headerName: "Start Time" },
		{ minWidth: 175, field: "end_time", headerName: "End Time" },
		{ minWidth: 100, field: "extra1", headerName: "Amount (oz)" },
	],
	pumping: [
		{ minWidth: 175, field: "start_time", headerName: "Start Time" },
		{ minWidth: 175, field: "end_time", headerName: "End Time" },
		{ minWidth: 100, field: "extra1", headerName: "Left or Right" },
	],
};

export const TABS = [
	"summary",
	"sleep",
	"diaper",
	"nursing",
	"bottle",
	"pumping",
] as const;
export const selectedTabAtom = atom<TabKey>(0);
export default selectedTabAtom;
