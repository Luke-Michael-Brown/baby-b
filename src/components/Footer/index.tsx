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
import AddIcon from '@mui/icons-material/Add';

const APP_VERSION = '1.4.0';

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
					sx={{ px: 2, py: 1, justifyContent: 'center' }}
					spacing={2}
				>
					<Stack sx={{ alignItems: 'center' }} direction="row">
						<AddIcon />
						<Typography variant="body1">Add Entry</Typography>
						<Typography sx={{ ml: 'auto' }} variant="body2">{`v${APP_VERSION}`}</Typography>
					</Stack>
					<ButtonGroup size="large" variant="contained" color="primary">
						{TABS.slice(1).map((tab) => (
							<Button onClick={() => onAddButtonClicked(tab)} key={tab}>
								{tab.charAt(0).toUpperCase() + tab.slice(1)}
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
