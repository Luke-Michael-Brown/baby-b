import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { TABS } from "../../atoms/selectedTabAtom";
import EntryDialog, { DEFAULT_ENTRY_DIALOG_PROPS } from '../EntryDialog';

function Footer() {
	const [entryDialogProps, setEntryDialogProps] = useState(DEFAULT_ENTRY_DIALOG_PROPS);
	const onAddButtonClicked = (tab) => {
		setEntryDialogProps({
			tab,
			open: true,
			handleClose: () => setEntryDialogProps((oldProps) => ({ ...oldProps, open: false })),
		});
	};

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="fixed" color="neutral" sx={{ top: "auto", bottom: 0 }}>
				<Stack
					sx={{ px: 2, py: 1 }}
					direction="row"
					spacing={2}
					alignItems="center"
				>
					<Typography variant="subtitle2">Add Entry:</Typography>
					<ButtonGroup size="large" variant="contained" color="neutral">
						{TABS.slice(1).map((tab) => (
							<Button onClick={() => onAddButtonClicked(tab)} key={tab}>
								{tab}
							</Button>
						))}
					</ButtonGroup>
					<EntryDialog {...entryDialogProps} />
				</Stack>
			</AppBar>
		</Box>
	);
}
export default Footer;
