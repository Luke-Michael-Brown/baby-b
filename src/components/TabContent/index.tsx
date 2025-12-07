import { useAtomValue } from 'jotai'
import SummaryTab from '../SummaryTab'
import DataTab from '../DataTab'
import selectedTabAtom from '../../atoms/selectedTabAtom'

function TabContent() {
  const selectedTab = useAtomValue(selectedTabAtom)
  switch (selectedTab) {
    case 0:
      return <SummaryTab />

    default:
      return <DataTab />
  }
}

export default TabContent
