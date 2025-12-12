import { useAtomValue } from 'jotai'
import SummaryTab from '../SummaryTab'
import DataTab from '../DataTab'
import selectedTabAtom from '../../atoms/selectedTabAtom'
import { Box } from '@mui/material'

function TabContent() {
  const { tabIndex } = useAtomValue(selectedTabAtom)

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        pb: '98px',
      }}
    >
      {tabIndex === 0 ? <SummaryTab /> : <DataTab />}
    </Box>
  )
}

export default TabContent
