// This file defines the EntryAdderButton component, a memoized React component
// that renders a button for adding new entries to a specific tab in the baby
// tracking application.
// It accepts a tab prop and uses a custom hook to open the entry dialog with the
// appropriate tab context.
// The button displays the capitalized tab name and triggers the dialog for data
// entry when clicked.

import { memo, useCallback } from 'react';
import { Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useEntryDialog } from '../../dialogs/EntryDialog';

interface Props {
  tab: string;
  sx?: SxProps<Theme>;
}

function EntryAdderButton(props: Props) {
  const { tab } = props;
  const { openEntryDialog } = useEntryDialog();

  const onAddButtonClicked = useCallback(() => {
    openEntryDialog({ tab: tab });
  }, [openEntryDialog, tab]);

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      size="medium"
      onClick={onAddButtonClicked}
      sx={props.sx}
    >
      {tab.charAt(0).toUpperCase() + tab.slice(1)}
    </Button>
  );
}

export default memo(EntryAdderButton);
