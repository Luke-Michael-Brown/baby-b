import { memo } from 'react';
import { Button } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useEntryDialog } from '../../dialogs/EntryDialog';

interface Props {
  tab: string;
  sx?: SxProps<Theme>;
}

function EntryAdderButton(props: Props) {
  const { openEntryDialog } = useEntryDialog();

  const onAddButtonClicked = () => {
    openEntryDialog({ tab: props.tab });
  };

  return (
    <Button
      fullWidth
      variant="contained"
      color="primary"
      size="medium"
      onClick={onAddButtonClicked}
      sx={props.sx}
    >
      {props.tab.charAt(0).toUpperCase() + props.tab.slice(1)}
    </Button>
  );
}

export default memo(EntryAdderButton);
