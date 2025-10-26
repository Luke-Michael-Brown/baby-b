import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { TABS } from "../../atoms/selectedTabAtom";

function Footer() {
	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="fixed" color="neutral" sx={{ top: "auto", bottom: 0 }}>
				<Stack sx={{ px: 2, py: 1 }} direction="row" spacing={2} alignItems="center">
					<Typography variant="subtitle2" >
						Add Entry:
					</Typography>
					<ButtonGroup size="large" variant="contained" color='neutral'>
						{TABS.slice(1).map((tab) => (
							<Button key={tab}>{tab}</Button>
						))}
					</ButtonGroup>
				</Stack>
			</AppBar>
		</Box>
	);
}
export default Footer;
