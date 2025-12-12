import React, { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import useBabyTabData from '../../hooks/useBabyTabData'

import selectedTabAtom, { COLUMNS } from '../../atoms/selectedTabAtom'
import { useDeleteDialog } from '../../dialogs/DeleteDialog'
import { useEntryDialog } from '../../dialogs/EntryDialog'

const paginationModel = { page: 0, pageSize: 100 }

function DataTab() {
  const { tab } = useAtomValue(selectedTabAtom)
  const { data: tabData } = useBabyTabData()
  const { openEntryDialog } = useEntryDialog()
  const { openDeleteDialog } = useDeleteDialog()

  const columns = useMemo(() => {
    return COLUMNS[tab].concat([
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        getActions: (params: { row: { id: string } }) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={e => {
              e.stopPropagation()
              openEntryDialog({
                tab,
                editId: params.row.id,
              })
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={e => {
              e.stopPropagation()
              openDeleteDialog({
                deleteId: params.row.id,
              })
            }}
          />,
        ],
      },
    ])
  }, [tab])
  return columns ? (
    <>
      <DataGrid
        rows={tabData}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        sx={{ border: 0 }}
      />
    </>
  ) : null
}

export default React.memo(DataTab)
