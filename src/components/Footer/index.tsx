import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { TABS } from "../../atoms/selectedTabAtom";
import type { EntryDialogProps } from "../EntryDialog";
import EntryDialog, { DEFAULT_ENTRY_DIALOG_PROPS } from "../EntryDialog";
import ThemedAppBar from "../ThemedAppBar";

function Footer() {
	const [entryDialogProps, setEntryDialogProps] = useState<EntryDialogProps>(
		DEFAULT_ENTRY_DIALOG_PROPS,
	);
	const onAddButtonClicked = (tab: string) => {
		setEntryDialogProps({
			tab,
			open: true,
			handleClose: () =>
				setEntryDialogProps((oldProps) => ({ ...oldProps, open: false })),
		});
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<ThemedAppBar
				position="fixed"
				color="primary"
				sx={{ top: "auto", bottom: 0 }}
			>
				<Stack
					sx={{ px: 2, py: 1 }}
					spacing={2}
				>
					<Typography variant="subtitle2">Add Entry</Typography>
					<ButtonGroup size="large" variant="contained" color="primary">
						{TABS.slice(1).map((tab) => (
							<Button onClick={() => onAddButtonClicked(tab)} key={tab}>
								{tab}
							</Button>
						))}
					</ButtonGroup>
					<EntryDialog {...entryDialogProps} />
				</Stack>
			</ThemedAppBar>
		</Box>
	);
}
export default Footer;
