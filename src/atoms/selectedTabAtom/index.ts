import { atom } from "jotai";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import CribIcon from "@mui/icons-material/Crib";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import JoinInnerIcon from "@mui/icons-material/JoinInner";

export const COLUMNS = {
	sleep: [
		{
			flex: 1,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
		},
		{
			flex: 1,
			field: "end_time",
			headerName: "End Time",
			formType: "datePicker",
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
		},
		{
			flex: 1,
			field: "extra1",
			headerName: "Type",
			formType: "select",
			selectFields: ["Pee", "Poo", "Pee & Poo"],
		},
	],
	nursing: [
		{
			flex: 1,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
		},
		{
			flex: 1,
			field: "end_time",
			headerName: "End Time",
			formType: "datePicker",
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
		},
		{
			flex: 1,
			field: "end_time",
			headerName: "End Time",
			formType: "datePicker",
		},
		{
			flex: 1,
			field: "extra1",
			headerName: "Amount (oz)",
			formType: "number",
		},
	],
	pumping: [
		{
			flex: 1,
			field: "start_time",
			headerName: "Start Time",
			formType: "datePicker",
		},
		{
			flex: 1,
			field: "end_time",
			headerName: "End Time",
			formType: "datePicker",
		},
		{
			flex: 1,
			field: "extra1",
			headerName: "Left or Right",
			formType: "select",
			selectFields: ["Left", "Right", "Both"],
		},
		{
			flex: 1,
			field: "extra2",
			headerName: "Amount (oz)",
			formType: "number",
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
};

// Helper: get start date based on range
function getStartDate(range) {
	const now = new Date();
	let startDate;

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

// Helper: filters entries by a date range
function filterByRange(data, range) {
	const startDate = getStartDate(range);
	return data.filter((entry) => new Date(entry.timestamp) >= startDate);
}

// Helper: computes number of days between start date and now
function getDaysInRange(range) {
	const now = new Date();
	const startDate = getStartDate(range);
	return (now - startDate) / (1000 * 60 * 60 * 24); // milliseconds → days
}

export const TAB_TO_SUMMARY_DATA = {
	bottle: (data, range) => {
		const filteredData = filterByRange(data, range);

		if (filteredData.length === 0) return ["No data yet"];

		let totalOz = 0;
		filteredData.forEach((entry) => {
			const ozMatch = entry.extra1.match(/([\d.]+)\s*oz/i);
			if (ozMatch) totalOz += parseFloat(ozMatch[1]);
		});

		const days = getDaysInRange(range);
		const avgPerDay = totalOz / days;

		return [`Averages ${avgPerDay.toFixed(2)}oz per day`];
	},
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

		const days = getDaysInRange(range);
		const avgPee = totalPee / days;
		const avgPoo = totalPoo / days;

		return [
			`Averages ${avgPee.toFixed(2)} pees per day`,
			`Averages ${avgPoo.toFixed(2)} poops per day`,
		];
	},
	nursing: (data, range) => {
		const filteredData = filterByRange(data, range);

		if (filteredData.length === 0) return ["No data yet"];

		let totalLeftMs = 0;
		let totalRightMs = 0;

		filteredData.forEach((entry) => {
			const start = new Date(entry.start_time);
			const end = new Date(entry.end_time);
			const duration = end - start; // milliseconds

			const side = entry.extra1.toLowerCase();
			if (side === "left") {
				totalLeftMs += duration;
			} else if (side === "right") {
				totalRightMs += duration;
			} else if (side === "both") {
				totalLeftMs += duration / 2;
				totalRightMs += duration / 2;
			}
		});

		const days = getDaysInRange(range);
		const avgLeft = totalLeftMs / (days * 1000 * 60); // convert ms → minutes
		const avgRight = totalRightMs / (days * 1000 * 60); // convert ms → minutes

		return [
			`Averages ${avgLeft.toFixed(2)}mins per day on left`,
			`Averages ${avgRight.toFixed(2)}mins per day on right`,
		];
	},
	pumping: (data, range) => {
		const filteredData = filterByRange(data, range);

		if (filteredData.length === 0) return ["No data yet"];

		let totalLeftMs = 0;
		let totalRightMs = 0;
		let totalOz = 0; // new

		filteredData.forEach((entry) => {
			const start = new Date(entry.start_time);
			const end = new Date(entry.end_time);
			const duration = end.getTime() - start.getTime(); // milliseconds

			const side = entry.extra1.toLowerCase();
			if (side === "left") {
				totalLeftMs += duration;
			} else if (side === "right") {
				totalRightMs += duration;
			} else if (side === "both") {
				totalLeftMs += duration / 2;
				totalRightMs += duration / 2;
			}

			// accumulate ounces
			const oz = parseFloat(entry.extra2);
			if (!isNaN(oz)) totalOz += oz;
		});

		const days = getDaysInRange(range);

		const avgLeft = totalLeftMs / (days * 1000 * 60); // ms → minutes
		const avgRight = totalRightMs / (days * 1000 * 60); // ms → minutes
		const avgOz = totalOz / days; // average oz per day

		return [
			`Averages ${avgLeft.toFixed(2)} mins per day on left`,
			`Averages ${avgRight.toFixed(2)} mins per day on right`,
			`Averages ${avgOz.toFixed(2)} oz per day`, // new
		];
	},
	sleep: (data, range) => {
		const filteredData = filterByRange(data, range);

		if (filteredData.length === 0) return ["No data yet"];

		let totalSleepMs = 0;
		let totalNapMs = 0;
		let totalNightMs = 0;

		filteredData.forEach((entry) => {
			const start = new Date(entry.start_time);
			const end = new Date(entry.end_time);
			const duration = end - start;

			totalSleepMs += duration;

			const type = entry.extra1.toLowerCase();
			if (type === "nap") totalNapMs += duration;
			else if (type === "night sleep") totalNightMs += duration;
		});

		const days = getDaysInRange(range);

		const avgTotal = totalSleepMs / (days * 1000 * 60);
		const avgNap = totalNapMs / (days * 1000 * 60);
		const avgNight = totalNightMs / (days * 1000 * 60);

		return [
			`Averages ${avgTotal.toFixed(2)}mins of sleep per day`,
			`Averages ${avgNap.toFixed(2)}mins of naps per day`,
			`Averages ${avgNight.toFixed(2)}mins of night sleep per day`,
		];
	},
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
