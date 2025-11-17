import { atom } from "jotai";
import Box from "@mui/material/Box";
import CribIcon from "@mui/icons-material/Crib";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import JoinInnerIcon from "@mui/icons-material/JoinInner";
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
			flex: number;
			field: string;
			headerName: string;
			formType: string;
	  }
	| {
			flex: number;
			field: string;
			headerName: string;
			formType: "select";
			selectFields: string[];
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
			flex: 1,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 1,
			field: "end_time",
			headerName: "End Time",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 1,
			field: "extra1",
			headerName: "Type",
			formType: "select",
			selectFields: ["Night Sleep", "Nap"],
		},
	],
	diaper: [
		{
			flex: 1,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 1,
			field: "extra1",
			headerName: "Type",
			formType: "select",
			selectFields: ["Pee", "Poo", "Pee & Poo"],
		},
	],
	nurse: [
		{
			flex: 1,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 1,
			field: "end_time",
			headerName: "End Time",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 1,
			field: "extra1",
			headerName: "Left or Right",
			formType: "select",
			selectFields: ["Left", "Right"],
		},
	],
	bottle: [
		{
			flex: 1,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{ flex: 1, field: "extra1", headerName: "Amount (ml)", formType: "number" },
	],
	pump: [
		{
			flex: 1,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
			renderCell: renderTwoLineDate,
		},
		{
			flex: 1,
			field: "extra1",
			headerName: "Left or Right",
			formType: "select",
			selectFields: ["Left", "Right", "Both"],
		},
		{ flex: 1, field: "extra2", headerName: "Amount (ml)", formType: "number" },
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

function getStartDate(range: RangeOption): Date {
	const now = new Date();
	let startDate: Date;

	switch (range) {
		case "Last Week":
			startDate = new Date();
			startDate.setDate(now.getDate() - 7);
			break;
		case "Last Month":
			startDate = new Date();
			startDate.setMonth(now.getMonth() - 1);
			break;
		case "Last Year":
			startDate = new Date();
			startDate.setFullYear(now.getFullYear() - 1);
			break;
		default:
			throw new Error("Invalid range");
	}

	return startDate;
}

function filterByRange(data: any[], range: RangeOption): any[] {
	const startDate = getStartDate(range);
	return data.filter((entry) => new Date(entry.start_time) >= startDate);
}

// --- Summary Generators ---
export const TAB_TO_SUMMARY_DATA: Record<
	string,
	(data: any[], range: RangeOption) => string[]
> = {
	//
	// ------------------------ BOTTLE ------------------------
	//
	bottle: (data, range) => {
		const filtered = filterByRange(data, range);
		if (filtered.length === 0) return ["No data yet"];

		let totalMl = 0;
		let sessionCount = 0;

		filtered.forEach((entry) => {
			const ml = parseFloat(entry.extra1);
			if (!isNaN(ml)) {
				totalMl += ml;
				sessionCount++;
			}
		});

		const days = getDaysWithData(filtered);
		const avgPerDay = totalMl / days;
		const avgPerSession = totalMl / sessionCount;

		return [
			`Averages ${avgPerDay.toFixed(2)} ml per day`,
			`Averages ${avgPerSession.toFixed(2)} ml per session`,
		];
	},

	//
	// ------------------------ DIAPER (unchanged) ------------------------
	//
	diaper: (data, range) => {
		const filteredData = filterByRange(data, range);
		if (filteredData.length === 0) return ["No data yet"];

		let totalPee = 0;
		let totalPoo = 0;

		filteredData.forEach((entry) => {
			const val = entry.extra1.toLowerCase();
			if (val.includes("pee")) totalPee += 1;
			if (val.includes("poo")) totalPoo += 1;
		});

		const days = getDaysWithData(filteredData);
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
	nurse: (data, range) => {
		const filtered = filterByRange(data, range);
		if (filtered.length === 0) return ["No data yet"];

		let leftTotalMs = 0;
		let rightTotalMs = 0;
		let leftSessions = 0;
		let rightSessions = 0;

		filtered.forEach((entry) => {
			const start = new Date(entry.start_time);
			const end = new Date(entry.end_time ?? entry.start_time);
			const duration = end.getTime() - start.getTime();
			const side = entry.extra1?.toLowerCase();

			if (side === "left") {
				leftTotalMs += duration;
				leftSessions++;
			} else if (side === "right") {
				rightTotalMs += duration;
				rightSessions++;
			}
		});

		const days = getDaysWithData(filtered);

		return [
			// LEFT
			`Left: ${formatMsToMinSec(leftTotalMs / days)} per day`,
			`Left: ${formatMsToMinSec(leftSessions > 0 ? leftTotalMs / leftSessions : 0)} per session`,

			// RIGHT
			`Right: ${formatMsToMinSec(rightTotalMs / days)} per day`,
			`Right: ${formatMsToMinSec(rightSessions > 0 ? rightTotalMs / rightSessions : 0)} per session`,
		];
	},

	//
	// ------------------------ PUMP ------------------------
	//
	pump: (data, range) => {
		const filtered = filterByRange(data, range);
		if (filtered.length === 0) return ["No data yet"];

		let leftTotalMl = 0;
		let rightTotalMl = 0;
		let leftSessions = 0;
		let rightSessions = 0;

		filtered.forEach((entry) => {
			const side = entry.extra1?.toLowerCase();
			const ml = parseFloat(entry.extra2);
			if (isNaN(ml)) return;

			if (side === "left") {
				leftTotalMl += ml;
				leftSessions++;
			} else if (side === "right") {
				rightTotalMl += ml;
				rightSessions++;
			} else if (side === "both") {
				leftTotalMl += ml / 2;
				rightTotalMl += ml / 2;
				leftSessions++;
				rightSessions++;
			}
		});

		const days = getDaysWithData(filtered);

		return [
			// LEFT
			`Left: ${(leftTotalMl / days).toFixed(2)} ml per day`,
			`Left: ${(leftSessions > 0 ? leftTotalMl / leftSessions : 0).toFixed(2)} ml per session`,

			// RIGHT
			`Right: ${(rightTotalMl / days).toFixed(2)} ml per day`,
			`Right: ${(rightSessions > 0 ? rightTotalMl / rightSessions : 0).toFixed(2)} ml per session`,
		];
	},

	//
	// ------------------------ SLEEP (unchanged) ------------------------
	//
	sleep: (data, range) => {
		const filteredData = filterByRange(data, range);
		if (filteredData.length === 0) return ["No data yet"];

		let totalSleepMs = 0;
		let totalNapMs = 0;
		let totalNightMs = 0;

		filteredData.forEach((entry) => {
			const start = new Date(entry.start_time);
			const end = new Date(entry.end_time ?? start);
			const duration = end.getTime() - start.getTime();

			totalSleepMs += duration;

			const type = entry.extra1.toLowerCase();
			if (type === "nap") totalNapMs += duration;
			else if (type === "night sleep") totalNightMs += duration;
		});

		const days = getDaysWithData(filteredData);
		const avgTotal = totalSleepMs / (days * 1000 * 60);
		const avgNap = totalNapMs / (days * 1000 * 60);
		const avgNight = totalNightMs / (days * 1000 * 60);

		return [
			`Averages ${avgTotal.toFixed(2)} mins of sleep per day`,
			`Averages ${avgNap.toFixed(2)} mins of naps per day`,
			`Averages ${avgNight.toFixed(2)} mins of night sleep per day`,
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
