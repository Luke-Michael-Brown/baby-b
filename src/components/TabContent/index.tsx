import React from 'react'
import { useAtomValue } from 'jotai'
import SummaryTab from '../../tabs/SummaryTab'
import DataTab from '../../tabs/DataTab'
import selectedTabAtom from '../../atoms/selectedTabAtom'

function TabContent() {
  const { tabIndex } = useAtomValue(selectedTabAtom)
  switch (tabIndex) {
    case 0:
      return <SummaryTab />

    default:
      return <DataTab />
  }
}

export default React.memo(TabContent)
