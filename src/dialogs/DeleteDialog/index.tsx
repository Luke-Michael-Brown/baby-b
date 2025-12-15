/* eslint-disable react-refresh/only-export-components */

import React from 'react'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

import useDeleteEntry from '../../hooks/useDeleteEntry'
import selectedBabyAtom from '../../atoms/selectedBabyAtom'
import selectedTabAtom from '../../atoms/selectedTabAtom'

interface DeleteDialogProps {
  deleteId?: string
}

const deleteDialogPropsAtom = atom<DeleteDialogProps>({})

export function useDeleteDialog() {
  const setDeleteDialogProps = useSetAtom(deleteDialogPropsAtom)
  const openDeleteDialog = (props: DeleteDialogProps) => {
    setDeleteDialogProps(props)
  }
  const closeDeleteDialog = () => {
    setDeleteDialogProps({})
  }

  return { openDeleteDialog, closeDeleteDialog }
}

export function DeleteDialog() {
  const { deleteId } = useAtomValue(deleteDialogPropsAtom)
  const { closeDeleteDialog } = useDeleteDialog()
  const [isLoading, setIsLoading] = React.useState(false)
  const onDelete = useDeleteEntry()

  const selectedBaby = useAtomValue(selectedBabyAtom)
  const { tab } = useAtomValue(selectedTabAtom)

  const onSubmit = async () => {
    if (!deleteId || !selectedBaby || !tab) return

    setIsLoading(true)
    try {
      await onDelete(deleteId, selectedBaby, tab)
      closeDeleteDialog()
      setIsLoading(false)
    } catch (err) {
      console.error(err)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={!!deleteId} onClose={closeDeleteDialog}>
      <DialogTitle>Delete Entry</DialogTitle>

      <DialogContent>
        <DialogContentText>Are you sure you want to delete this?</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button disabled={isLoading} onClick={closeDeleteDialog}>
          Cancel
        </Button>
        <Button disabled={isLoading} onClick={onSubmit} color="error" variant="contained">
          {isLoading ? 'Deleting' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(DeleteDialog)
