import { atom } from 'jotai'

export interface EntryDialogProps {
  tab: string
  editId?: string
  open: boolean
  handleClose: () => void
}

export const entryDialogPropsAtom = atom<EntryDialogProps>({
  tab: '',
  open: false,
  handleClose: () => {},
})
export default entryDialogPropsAtom
