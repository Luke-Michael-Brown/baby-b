// Tab component that provides a data grid interface for viewing, editing, and
// deleting baby tracking entries, integrated with Material-UI DataGrid for
// efficient data management.

import { memo, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridRowParams,
} from '@mui/x-data-grid';

import selectedTabAtom from '../../atoms/selectedTabAtom';
import TwoLineDate from '../../components/TwoLineDate';
import { useDeleteDialog } from '../../dialogs/DeleteDialog';
import { useEntryDialog } from '../../dialogs/EntryDialog';
import useBabyTabData from '../../hooks/useBabyTabData';
import gramsToLB from '../../utils/gramsToLB';
import cmToInchesAndFeet from '../../utils/cmToInchesAndFeet';

const paginationModel = { page: 0, pageSize: 100 };
const FIELD_TO_FLEX = {
  datePicker: 100,
  number: 80,
  checkbox: 90,
} as const;

function DataTab() {
  const { tab, tabConfig } = useAtomValue(selectedTabAtom);
  const { data: tabData } = useBabyTabData();
  const { openEntryDialog } = useEntryDialog();
  const { openDeleteDialog } = useDeleteDialog();

  const columns = useMemo<GridColDef[]>(() => {
    const baseColumns: GridColDef[] =
      tabConfig?.fields?.map(field => {
        const column: GridColDef = {
          ...field.columnFields,
          flex:
            FIELD_TO_FLEX[field.formType as keyof typeof FIELD_TO_FLEX] ?? 100,
        };

        switch (field.formType) {
          case 'datePicker':
            column.renderCell = params => (
              <TwoLineDate date={params.value as string | undefined} />
            );
            break;

          case 'checkbox':
            column.renderCell = params => (params.value ? '✓' : '');
            break;

          case 'number':
            if (field.columnFields.headerName === 'grams') {
              column.renderCell = params =>
                `${params.value}g (${gramsToLB(params.value)})`;
            } else if (field.columnFields.headerName === 'cm') {
              column.renderCell = params =>
                `${params.value}cm (${cmToInchesAndFeet(params.value)})`;
            }
        }

        return column;
      }) ?? [];

    const actionsColumn: GridColDef = {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      getActions: (params: GridRowParams) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Edit"
          onClick={e => {
            e.stopPropagation();
            openEntryDialog({
              tab,
              editId: params.row.id,
            });
          }}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Delete"
          onClick={e => {
            e.stopPropagation();
            openDeleteDialog({
              deleteId: params.row.id,
            });
          }}
        />,
      ],
    };

    return [...baseColumns, actionsColumn];
  }, [openDeleteDialog, openEntryDialog, tab, tabConfig]);

  return columns ? (
    <DataGrid
      rows={tabData}
      columns={columns}
      initialState={{ pagination: { paginationModel } }}
      sx={{ border: 0 }}
    />
  ) : null;
}

export default memo(DataTab);
