import * as React from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useAtomValue, useSetAtom } from 'jotai'
import Button from '@mui/material/Button'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import selectedBabyAtom from '../../atoms/selectedBabyAtom'
import useAddEntry from '../../hooks/useAddEntry'
import useEditEntry from '../../hooks/useEditEntry'
import useBabiesData from '../../hooks/useBabiesData'
import selectedTabAtom, { TABS, COLUMNS } from '../../atoms/selectedTabAtom'
import { atom } from 'jotai'

export interface EntryDialogProps {
  tab?: string
  editId?: string
}

export const entryDialogPropsAtom = atom<EntryDialogProps>({})

export function useEntryDialog() {
  const setEntryDialogProps = useSetAtom(entryDialogPropsAtom)
  const openEntryDialog = (props: EntryDialogProps) => {
    setEntryDialogProps(props)
  }
  const closeEntryDialog = () => {
    setEntryDialogProps({})
  }

  return { openEntryDialog, closeEntryDialog }
}

export default function EntryDialog() {
  const { tab, editId } = useAtomValue(entryDialogPropsAtom)
  const { closeEntryDialog } = useEntryDialog()
  const { data: babiesData } = useBabiesData()

  const selectedBaby = useAtomValue(selectedBabyAtom)
  const setSelectedTab = useSetAtom(selectedTabAtom)

  const addEntry = useAddEntry()
  const editEntry = useEditEntry()

  const [isLoading, setIsLoading] = React.useState(false)
  const [formValues, setFormValues] = React.useState<Record<string, any>>({})

  React.useEffect(() => {
    if (tab && COLUMNS[tab]) {
      const initialValues: Record<string, any> = {}
      let editEntry: any = {}
      if (editId && selectedBaby && tab) {
        const editIndex = babiesData[selectedBaby][tab].findIndex(
          (entry: any) => entry.id === editId
        )
        if (editIndex !== -1) {
          editEntry = babiesData[selectedBaby][tab][editIndex]
        }
      }

      COLUMNS[tab].forEach(col => {
        if (col.formType === 'datePicker') initialValues[col.field] = dayjs(editEntry[col.field])
        else {
          initialValues[col.field] =
            col.formType === 'checkbox' ? !!editEntry[col.field] : (editEntry[col.field] ?? '')
        }
      })

      setIsLoading(false)
      setFormValues(initialValues)
    }
  }, [open, tab, editId, selectedBaby, babiesData])

  const handleChange = (field: string, value: any) => {
    setFormValues(prev => ({ ...prev, [field]: value }))
  }

  const allFilled = React.useMemo(() => {
    return Object.entries(formValues).every(([key, v]) => {
      if (key === 'vitaminD') return true // optional boolean
      return v !== '' && v !== null && v !== undefined
    })
  }, [formValues])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!tab) throw new Error('Tab not selected')
      if (!selectedBaby) throw new Error('Baby not selected')
      if (editId) {
        await editEntry(editId, selectedBaby, tab, formValues)
      } else {
        await addEntry(selectedBaby, tab, formValues)
      }
      setSelectedTab(TABS.indexOf(tab))
      closeEntryDialog()
    } catch (err) {
      console.error(err)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={!!tab} onClose={closeEntryDialog}>
      <DialogTitle>{editId ? `Edit ${tab} entry` : `Add ${tab} entry`}</DialogTitle>
      <DialogContent>
        <form id="add-entry-form" onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            {tab &&
              COLUMNS[tab]?.map?.((column: any) => {
                const field = column.field
                const label = column.headerName
                const value = formValues[field] ?? ''

                switch (column.formType) {
                  case 'datePicker':
                    return (
                      <DateTimePicker
                        key={field}
                        label={label}
                        value={value as Dayjs | null}
                        onChange={newValue => handleChange(field, newValue)}
                        openTo="hours"
                        slotProps={{
                          popper: {
                            modifiers: [
                              {
                                name: 'flip',
                                enabled: true,
                                options: {
                                  altBoundary: true,
                                  rootBoundary: 'viewport',
                                  padding: 8,
                                },
                              },
                              {
                                name: 'preventOverflow',
                                enabled: true,
                                options: {
                                  altAxis: true,
                                  tether: true,
                                },
                              },
                            ],
                          },
                          textField: { required: true, fullWidth: true },
                        }}
                      />
                    )

                  case 'select':
                    return (
                      <Select
                        key={field}
                        required
                        fullWidth
                        name={field}
                        value={value}
                        displayEmpty
                        onChange={e => handleChange(field, e.target.value)}
                      >
                        <MenuItem value="">
                          <em>Select {label}</em>
                        </MenuItem>
                        {column.selectFields.map((selectField: string) => (
                          <MenuItem key={selectField} value={selectField}>
                            {selectField}
                          </MenuItem>
                        ))}
                      </Select>
                    )

                  case 'checkbox':
                    return (
                      <label key={field} style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                          type="checkbox"
                          checked={!!value}
                          onChange={e => handleChange(field, e.target.checked)}
                          style={{ marginRight: 8 }}
                        />
                        {label}
                      </label>
                    )

                  case 'number':
                    return (
                      <TextField
                        key={field}
                        label={label}
                        name={field}
                        type="number"
                        required
                        fullWidth
                        value={value}
                        onChange={e => handleChange(field, e.target.value)}
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                        }}
                      />
                    )

                  default:
                    return null
                }
              })}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button disabled={isLoading} onClick={closeEntryDialog}>
          Cancel
        </Button>
        <Button
          type="submit"
          form="add-entry-form"
          disabled={isLoading || !allFilled}
          variant="contained"
        >
          {isLoading
            ? editId
              ? 'Editting...'
              : 'Adding...'
            : editId
              ? 'Edit Entry '
              : 'Add Entry'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
