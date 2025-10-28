import * as React from "react";
import dayjs from "dayjs";
import { useAtomValue } from 'jotai';
import Button from "@mui/material/Button";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { COLUMNS } from "../../atoms/selectedTabAtom";
import selectedBabyAtom from "../../atoms/selectedBabyAtom";
import useBabiesData from '../../hooks/useBabiesData';
import useGoogleAPI from '../../hooks/useGoogleAPI';

export const DEFAULT_ENTRY_DIALOG_PROPS = {
  tab: "",
  open: false,
  handleClose: () => {},
};

interface Props {
  tab: string;
  open: boolean;
  handleClose: () => void;
}

export default function EntryDialog({ tab, open, handleClose }: Props) {
  const { data: babiesData } = useBabiesData();
  const { uploadJsonToDrive } = useGoogleAPI();
  const selectedBaby = useAtomValue(selectedBabyAtom);

  const [formValues, setFormValues] = React.useState<Record<string, any>>({});

  // Initialize form values when tab changes
  React.useEffect(() => {
    const initialValues: Record<string, any> = {};
    COLUMNS[tab]?.forEach((col) => {
      if (col.formType === "datePicker") initialValues[col.field] = dayjs();
      else if (col.formType === "number") initialValues[col.field] = "";
      else initialValues[col.field] = "";
    });
    setFormValues(initialValues);
  }, [tab]);

  const handleChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const allFilled = React.useMemo(() => {
    return Object.values(formValues).every(
      (v) => v !== "" && v !== null && v !== undefined,
    );
  }, [formValues]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    babiesData[selectedBaby][tab].push({
      ...formValues,
      babyName: selectedBaby,
      isShown: true,
      timestamp: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
      id: crypto.randomUUID(),
    });

    await uploadJsonToDrive(babiesData);

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`Add ${tab} entry`}</DialogTitle>
      <DialogContent>
        <form id="add-entry-form" onSubmit={handleSubmit}>
          <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
            {COLUMNS[tab]?.map?.((column) => {
              const field = column.field;
              const label = column.headerName;
              const value = formValues[field] ?? "";

              switch (column.formType) {
                case "datePicker":
                  return (
                    <DateTimePicker
                      key={field}
                      label={label}
                      value={value}
                      onChange={(newValue) => handleChange(field, newValue)}
                      slotProps={{
                        textField: { required: true, fullWidth: true },
                      }}
                    />
                  );

                case "select":
                  return (
                    <Select
                      key={field}
                      required
                      fullWidth
                      name={field}
                      value={value}
                      displayEmpty
                      onChange={(e) => handleChange(field, e.target.value)}
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
                  );

                case "number":
                  return (
                    <TextField
                      key={field}
                      label={label}
                      name={field}
                      type="number"
                      required
                      fullWidth
                      value={value}
                      onChange={(e) => handleChange(field, e.target.value)}
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
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
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          type="submit"
          form="add-entry-form"
          disabled={!allFilled}
          variant="contained"
        >
          Add Entry
        </Button>
      </DialogActions>
    </Dialog>
  );
}
