import { atom } from 'jotai'

export interface DeleteDialogProps {
  deleteId?: string
  handleClose?: () => void
}

export const deleteDialogPropsAtom = atom<DeleteDialogProps>({})
export default deleteDialogPropsAtom
