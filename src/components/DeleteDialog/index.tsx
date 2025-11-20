import * as React from "react";
import { useAtomValue } from "jotai";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import useDeleteEntry from '../../hooks/useDeleteEntry';
import selectedBabyAtom from '../../atoms/selectedBabyAtom';
import selectedTabAtom, { TABS } from '../../atoms/selectedTabAtom';

export interface DeleteDialogProps {
  deleteId?: string;
  handleClose?: () => void;
}

export default function DeleteDialog({
  deleteId,
  handleClose,
}: DeleteDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const onDelete = useDeleteEntry();

  const selectedBaby = useAtomValue(selectedBabyAtom);
  const selectedTab = useAtomValue(selectedTabAtom);
  const tab = TABS[selectedTab];

  const onSubmit = async () => {
    if (!deleteId || !selectedBaby || !tab) return;

    setIsLoading(true);
    try {
      await onDelete(deleteId, selectedBaby, tab);
      handleClose?.();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    } 
  }

  return (
    <Dialog open={!!deleteId} onClose={handleClose}>
      <DialogTitle>Delete Entry</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button disabled={isLoading} onClick={handleClose}>Cancel</Button>
        <Button
          disabled={isLoading}
          onClick={onSubmit}
          color="error"
          variant="contained"
        >
          {isLoading ? "Deleting" : "Delete" }
        </Button>
      </DialogActions>
    </Dialog>
  );
}
