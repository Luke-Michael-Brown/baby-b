// Dialog component for DeleteDialog
/* eslint-disable react-refresh/only-export-components */

import { memo, useCallback, useState } from 'react';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import selectedBabyAtom from '../../atoms/selectedBabyAtom';
import selectedTabAtom from '../../atoms/selectedTabAtom';
import useDeleteEntry from '../../hooks/useDeleteEntry';

interface DeleteDialogProps {
  deleteId?: string;
}

const deleteDialogPropsAtom = atom<DeleteDialogProps>({});

export function useDeleteDialog() {
  const setDeleteDialogProps = useSetAtom(deleteDialogPropsAtom);
  const openDeleteDialog = useCallback((props: DeleteDialogProps) => {
    setDeleteDialogProps(props);
  }, []);
  const closeDeleteDialog = useCallback(() => {
    setDeleteDialogProps({});
  }, []);

  return { openDeleteDialog, closeDeleteDialog };
}

export function DeleteDialog() {
  const { deleteId } = useAtomValue(deleteDialogPropsAtom);
  const { closeDeleteDialog } = useDeleteDialog();
  const [isLoading, setIsLoading] = useState(false);
  const onDelete = useDeleteEntry();

  const selectedBaby = useAtomValue(selectedBabyAtom);
  const { tab } = useAtomValue(selectedTabAtom);

  const onSubmit = async () => {
    if (!deleteId || !selectedBaby || !tab) return;

    setIsLoading(true);
    try {
      await onDelete(deleteId, selectedBaby, tab);
      closeDeleteDialog();
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!deleteId} onClose={closeDeleteDialog}>
      <DialogTitle>Delete Entry</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this?
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button disabled={isLoading} onClick={closeDeleteDialog}>
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          onClick={onSubmit}
          color="error"
          variant="contained"
        >
          {isLoading ? 'Deleting' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default memo(DeleteDialog);
