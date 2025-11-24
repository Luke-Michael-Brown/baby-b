import { atom } from "jotai";
import { Dayjs } from "dayjs";
import Box from "@mui/material/Box";
import CribIcon from "@mui/icons-material/Crib";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
import type { GridColType, GridRowParams } from "@mui/x-data-grid";
import appIconUrl from "../../assets/baby_b_svg.svg";

// --- Types ---
export type TabKey =
	| "summary"
	| "sleep"
	| "diaper"
	| "nurse"
	| "bottle"
	| "pump";

export type RangeOption = "Last Week" | "Last Month" | "Last Year";

type COLUMN_ENTRY =
	| {
			flex?: number;
			field: string;
			headerName: string;
			formType?: string;
			type?: GridColType;
			getActions?: (params: GridRowParams) => React.ReactNode[];
			renderCell?: (param: any) => any;
	  }
	| {
			flex?: number;
			field: string;
			headerName: string;
			formType: "select";
			selectFields: string[];
			type?: GridColType;
			getActions?: (params: GridRowParams) => React.ReactNode[];
			renderCell?: (param: any) => any;
	  };

const renderTwoLineDate = (params: any) => {
	const value = params.value;
	if (!value) return "";

	const d = new Date(value);

	const dateStr = d.toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	const timeStr = d.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	return (
		<div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
			<span>{dateStr}</span>
			<span>{timeStr}</span>
		</div>
	);
};

export const COLUMNS: { [key: string]: COLUMN_ENTRY[] } = {
	sleep: [
		{
			flex: 100,
			field: "start_time",
			headerName: "Start",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 100,
			field: "end_time",
			headerName: "End",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 100,
			field: "extra1",
			headerName: "Type",
			formType: "select",
			selectFields: ["Night Sleep", "Nap"],
		},
	],
	diaper: [
		{
			flex: 100,
			field: "start_time",
			headerName: "Start",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 100,
			field: "extra1",
			headerName: "Type",
			formType: "select",
			selectFields: ["Pee", "Poo", "Pee & Poo"],
		},
	],
	nurse: [
		{
			flex: 100,
			field: "start_time",
			headerName: "Start",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 100,
			field: "end_time",
			headerName: "End",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 100,
			field: "extra1",
			headerName: "Side",
			formType: "select",
			selectFields: ["Left", "Right", "Both"],
		},
		{
			flex: 90,
			field: "extra2",
			headerName: "VitD",
			formType: "checkbox",
			renderCell: (params) => (params.value ? "✓" : ""),
		},
	],
	bottle: [
		{
			flex: 100,
			field: "start_time",
			headerName: "Start",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 60,
			field: "extra1",
			headerName: "mL",
			formType: "number",
		},
		{
			flex: 60,
			field: "extra2",
			headerName: "VitD",
			formType: "checkbox",
			renderCell: (params) => (params.value ? "✓" : ""),
		},
	],
	pump: [
		{
			flex: 100,
			field: "start_time",
			headerName: "Start",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 60,
			field: "extra2",
			headerName: "mL",
			formType: "number",
		},
		{
			flex: 60,
			field: "extra3",
			headerName: "Power",
			formType: "checkbox",
			renderCell: (params) => (params.value ? "✓" : ""),
		},
	],
};

export const TABS_TO_ICON: { [key: string]: any } = {
	summary: () => (
		<Box
			component="img"
			src={appIconUrl}
			alt="Example"
			sx={(theme) => ({
				width: "3em",
				height: "3em",
				verticalAlign: "middle",
				filter:
					theme.palette.mode === "light" ? "invert(1) brightness(1.2)" : "none",
			})}
		/>
	),
	sleep: CribIcon,
	diaper: BabyChangingStationIcon,
	nurse: PregnantWomanIcon,
	bottle: WaterDropIcon,
	pump: JoinInnerIcon,
};

// --- Helpers ---
function formatMsToMinSec(ms: number): string {
	if (!ms || ms <= 0) return "0s";

	const totalSeconds = Math.floor(ms / 1000);
	const mins = Math.floor(totalSeconds / 60);
	const secs = totalSeconds % 60;

	if (mins > 0) return `${mins}m ${secs}s`;
	return `${secs}s`;
}

function getDaysWithData(filteredData: any[]): number {
	const uniqueDays = new Set<string>();
	filteredData.forEach((entry) => {
		const d = new Date(entry.start_time);
		const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
		uniqueDays.add(key);
	});
	return uniqueDays.size;
}

// --- Summary Generators ---
export const TAB_TO_SUMMARY_DATA: Record<
	string,
	(data: any[], opts: { startDate: Dayjs; endDate: Dayjs }) => string[]
> = {
	//
	// ------------------------ BOTTLE ------------------------
	//
	bottle: (data) => {
		if (data.length === 0) return ["No data in range"];

		let totalMl = 0;
		let sessionCount = 0;

		data.forEach((entry) => {
			const ml = parseFloat(entry.extra1);
			if (!isNaN(ml)) {
				totalMl += ml;
				sessionCount++;
			}
		});

		const days = getDaysWithData(data);
		const avgPerDay = totalMl / days;
		const avgPerSession = totalMl / sessionCount;

		return [
			`Averages ${avgPerDay.toFixed(2)} ml per day`,
			`Averages ${avgPerSession.toFixed(2)} ml per session`,
		];
	},

	//
	// ------------------------ DIAPER ------------------------
	//
	diaper: (data) => {
		if (data.length === 0) return ["No data in range"];

		let totalPee = 0;
		let totalPoo = 0;

		data.forEach((entry) => {
			const val = entry.extra1.toLowerCase();
			if (val.includes("pee")) totalPee += 1;
			if (val.includes("poo")) totalPoo += 1;
		});

		const days = getDaysWithData(data);
		const avgPee = totalPee / days;
		const avgPoo = totalPoo / days;

		return [
			`Averages ${avgPee.toFixed(2)} pees per day`,
			`Averages ${avgPoo.toFixed(2)} poops per day`,
		];
	},

	//
	// ------------------------ NURSE ------------------------
	//
	nurse: (data) => {
		if (data.length === 0) return ["No data in range"];

		let totalMs = 0;
		let sessions = 0;

		data.forEach((entry) => {
			const start = new Date(entry.start_time);
			const end = new Date(entry.end_time ?? entry.start_time);
			const duration = end.getTime() - start.getTime();

			totalMs += duration;
			sessions++;
		});

		const days = getDaysWithData(data);

		return [
			`Averages ${formatMsToMinSec(totalMs / days)} per day`,
			`Averages ${formatMsToMinSec(sessions > 0 ? totalMs / sessions : 0)} per session`,
		];
	},

	//
	// ------------------------ PUMP ------------------------
	//
	pump: (data) => {
		if (data.length === 0) return ["No data in range"];

		let totalMl = 0;
		let sessions = 0;

		data.forEach((entry) => {
			const ml = parseFloat(entry.extra2);
			if (!isNaN(ml)) {
				totalMl += ml;
				sessions++;
			}
		});

		const days = getDaysWithData(data);

		return [
			`Average: ${(totalMl / days).toFixed(2)} ml per day`,
			`Average: ${(sessions > 0 ? totalMl / sessions : 0).toFixed(2)} ml per session`,
		];
	},

	//
	// ------------------------ SLEEP ------------------------
	//
	sleep: (data) => {
		if (data.length === 0) return ["No data in range"];

		let totalSleepMs = 0;
		let totalNapMs = 0;
		let totalNightMs = 0;

		data.forEach((entry) => {
			const start = new Date(entry.start_time);
			const end = new Date(entry.end_time ?? start);
			const duration = end.getTime() - start.getTime();

			totalSleepMs += duration;

			const type = entry.extra1.toLowerCase();
			if (type === "nap") totalNapMs += duration;
			else if (type === "night sleep") totalNightMs += duration;
		});

		const days = getDaysWithData(data);

		return [
			`Averages ${(totalSleepMs / (days * 1000 * 60)).toFixed(2)} mins of sleep per day`,
			`Averages ${(totalNapMs / (days * 1000 * 60)).toFixed(2)} mins of naps per day`,
			`Averages ${(totalNightMs / (days * 1000 * 60)).toFixed(2)} mins of night sleep per day`,
		];
	},
};

// --- Tabs ---
export const TABS: string[] = [
	"summary",
	"sleep",
	"diaper",
	"nurse",
	"bottle",
	"pump",
];

export const selectedTabAtom = atom<number>(0);
export default selectedTabAtom;
