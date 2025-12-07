import { useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'

import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import useBabyTabData from '../../hooks/useBabyTabData'

import selectedTabAtom, { TABS, COLUMNS } from '../../atoms/selectedTabAtom'
import entryDialogPropsAtom from '../../atoms/entryDialogPropsAtom'
import { deleteDialogPropsAtom } from '../../atoms/deleteDialogPropsAtom'

const paginationModel = { page: 0, pageSize: 100 }

function DataTab() {
  const selectedTab = useAtomValue(selectedTabAtom)
  const tab = TABS[selectedTab]
  const { data: tabData } = useBabyTabData()
  const setEntryDialogProps = useSetAtom(entryDialogPropsAtom)
  const setDeleteDialogProps = useSetAtom(deleteDialogPropsAtom)

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
              setEntryDialogProps({
                tab,
                open: true,
                editId: params.row.id,
                handleClose: () =>
                  setEntryDialogProps(oldProps => ({
                    ...oldProps,
                    open: false,
                  })),
              })
            }}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={e => {
              e.stopPropagation()
              setDeleteDialogProps({
                deleteId: params.row.id,
                handleClose: () =>
                  setDeleteDialogProps(oldProps => ({
                    ...oldProps,
                    deleteId: undefined,
                  })),
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

export default DataTab
