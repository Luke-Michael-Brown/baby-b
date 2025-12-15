import React from 'react';
import { useAtomValue } from 'jotai';
import selectedTabAtom from '../../atoms/selectedTabAtom';
import config from '../../config';

function TabContent() {
  const { tab } = useAtomValue(selectedTabAtom);
  const TabComponent = config[tab].TabComponent;
  return TabComponent ? <TabComponent /> : null;
}

export default React.memo(TabContent);
