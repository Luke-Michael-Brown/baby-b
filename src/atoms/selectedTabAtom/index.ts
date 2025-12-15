import { atom } from 'jotai';
import config from '../../config';

// --- Tabs ---
export const TABS: string[] = Object.keys(config).filter(
  tab => config[tab].TabComponent,
);

const selectedTabAtom = atom<string>(TABS[0]);

export default atom(
  get => {
    const tab = get(selectedTabAtom);
    const tabConfig = config[tab];

    return {
      tab,
      tabConfig,
    };
  },
  (_get, set, newTab: string) => {
    set(selectedTabAtom, newTab);
  },
);
