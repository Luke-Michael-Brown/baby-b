import { atom } from "jotai";

export const COLUMNS = {
	sleep: [
		{
			minWidth: 175,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
		},
		{
			minWidth: 175,
			field: "end_time",
			headerName: "End Time",
			formType: "datePicker",
		},
		{
			minWidth: 100,
			field: "extra1",
			headerName: "Type",
			formType: "select",
			selectFields: ["Night Sleep", "Nap"],
		},
	],
	diaper: [
		{
			minWidth: 175,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
		},
		{
			minWidth: 175,
			field: "extra1",
			headerName: "Type",
			formType: "select",
			selectFields: ["Pee", "Poo", "Pee & Poo"],
		},
	],
	nursing: [
		{
			minWidth: 175,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
		},
		{
			minWidth: 175,
			field: "end_time",
			headerName: "End Time",
			formType: "datePicker",
		},
		{
			minWidth: 100,
			field: "extra1",
			headerName: "Left or Right",
			formType: "select",
			selectFields: ["Left", "Right"],
		},
	],
	bottle: [
		{
			minWidth: 175,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
		},
		{
			minWidth: 175,
			field: "end_time",
			headerName: "End Time",
			formType: "datePicker",
		},
		{
			minWidth: 100,
			field: "extra1",
			headerName: "Amount (oz)",
			formType: "number",
		},
	],
	pumping: [
		{
			minWidth: 175,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
		},
		{
			minWidth: 175,
			field: "end_time",
			headerName: "End Time",
			formType: "datePicker",
		},
		{
			minWidth: 100,
			field: "extra1",
			headerName: "Left or Right",
			formType: "select",
			selectFields: ["Left", "Right", "Both"],
		},
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
