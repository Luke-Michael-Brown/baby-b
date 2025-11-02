import { atom } from "jotai";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import CribIcon from '@mui/icons-material/Crib';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import JoinInnerIcon from '@mui/icons-material/JoinInner';

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

export const TABS_TO_ICON = {
	summary: ChildFriendlyIcon,
	sleep: CribIcon,
	diaper: BabyChangingStationIcon,
	nursing: PregnantWomanIcon,
	bottle: WaterDropIcon,
	pumping: JoinInnerIcon,
}

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
