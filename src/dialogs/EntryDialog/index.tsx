/* eslint-disable react-refresh/only-export-components */

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { atom } from 'jotai';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

import selectedBabyAtom from '../../atoms/selectedBabyAtom';
import selectedTabAtom from '../../atoms/selectedTabAtom';
import config from '../../config';
import useAddEntry from '../../hooks/useAddEntry';
import useBabiesData from '../../hooks/useBabiesData';
import useEditEntry from '../../hooks/useEditEntry';
import type { Entry } from '../../types';
import floorTo15 from '../../utils/floorNearest15';

export interface EntryDialogProps {
  tab?: string;
  editId?: string;
}

export const entryDialogPropsAtom = atom<EntryDialogProps>({});

export function useEntryDialog() {
  const setEntryDialogProps = useSetAtom(entryDialogPropsAtom);
  const openEntryDialog = useCallback((props: EntryDialogProps) => {
    setEntryDialogProps(props);
  }, []);
  const closeEntryDialog = useCallback(() => {
    setEntryDialogProps({});
  }, []);

  return { openEntryDialog, closeEntryDialog };
}

export function EntryDialog() {
  const { tab, editId } = useAtomValue(entryDialogPropsAtom);
  const tabConfig = config[tab ?? ''];
  const Icon = tabConfig ? tabConfig.Icon : () => null;

  const { closeEntryDialog } = useEntryDialog();
  const { data: babiesData } = useBabiesData();

  const selectedBaby = useAtomValue(selectedBabyAtom);
  const setSelectedTab = useSetAtom(selectedTabAtom);

  const addEntry = useAddEntry();
  const editEntry = useEditEntry();

  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState<
    Record<string, string | number | boolean | undefined | Dayjs | null>
  >({});

  useEffect(() => {
    if (tab && tabConfig) {
      const initialValues: Record<
        string,
        string | number | boolean | undefined | Dayjs | null
      > = {};
      let editEntry: Record<
        string,
        string | number | boolean | undefined | Dayjs | null
      > = {};
      if (editId && selectedBaby && tab && babiesData) {
        const editIndex = babiesData[selectedBaby][tab].findIndex(
          (entry: Entry) => entry.id === editId,
        );
        if (editIndex !== -1) {
          editEntry = babiesData[selectedBaby][tab][editIndex];
        }
      }

      tabConfig.fields?.forEach(field => {
        if (field.formType === 'datePicker') {
          const editEntryDate = editEntry[field.columnFields.field];
          initialValues[field.columnFields.field] = editEntryDate
            ? dayjs(editEntryDate as string)
            : floorTo15(dayjs());
        } else {
          initialValues[field.columnFields.field] =
            field.formType === 'checkbox'
              ? !!editEntry[field.columnFields.field]
              : (editEntry[field.columnFields.field] ?? '');
        }
      });

      setIsLoading(false);
      setFormValues(initialValues);
    }
  }, [tab, editId, selectedBaby, babiesData, tabConfig]);

  const handleChange = (
    field: string,
    value: string | number | boolean | Dayjs | null,
  ) => {
    setFormValues(prev => ({ ...prev, [field]: value }));
  };

  const allFilled = useMemo(() => {
    return Object.entries(formValues).every(([key, v]) => {
      if (key === 'vitaminD') return true; // optional boolean
      return v !== '' && v !== null && v !== undefined;
    });
  }, [formValues]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!tab) throw new Error('Tab not selected');
      if (!selectedBaby) throw new Error('Baby not selected');
      if (editId) {
        await editEntry(editId, selectedBaby, tab, formValues);
      } else {
        await addEntry(selectedBaby, tab, formValues);
      }
      setSelectedTab(tab);
      closeEntryDialog();
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={!!tab} onClose={closeEntryDialog}>
      <DialogTitle sx={{ alignItems: 'center' }}>
        <Icon sx={{ fontSize: '1.25rem', mr: 0.5 }} />
        {editId ? `Edit ${tab} entry` : `Add ${tab} entry`}
      </DialogTitle>
      <DialogContent>
        <form id="add-entry-form" onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            {tab &&
              tabConfig?.fields?.map?.(field => {
                const key = field.columnFields.field;
                const label = field.columnFields.headerName;
                const value = formValues[key] ?? '';

                switch (field.formType) {
                  case 'datePicker':
                    return (
                      <DateTimePicker
                        key={key}
                        label={label}
                        value={value as Dayjs | null}
                        onChange={newValue => handleChange(key, newValue)}
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
                    );

                  case 'select':
                    return (
                      <Select
                        key={key}
                        required
                        fullWidth
                        name={key}
                        value={value}
                        displayEmpty
                        onChange={e => handleChange(key, e.target.value)}
                      >
                        <MenuItem value="">
                          <em>Select {label}</em>
                        </MenuItem>
                        {field?.selectFields?.map((selectField: string) => (
                          <MenuItem key={selectField} value={selectField}>
                            {selectField}
                          </MenuItem>
                        ))}
                      </Select>
                    );

                  case 'checkbox':
                    return (
                      <label
                        key={key}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <input
                          type="checkbox"
                          checked={!!value}
                          onChange={e => handleChange(key, e.target.checked)}
                          style={{ marginRight: 8 }}
                        />
                        {label}
                      </label>
                    );

                  case 'number':
                    return (
                      <TextField
                        key={key}
                        label={label}
                        name={key}
                        type="number"
                        required
                        fullWidth
                        value={value}
                        onChange={e => handleChange(key, e.target.value)}
                        inputProps={{
                          inputMode: 'numeric',
                          pattern: '[0-9]*',
                        }}
                      />
                    );

                  default:
                    return null;
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
  );
}

export default memo(EntryDialog);
