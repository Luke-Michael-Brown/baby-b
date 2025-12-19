// This file defines a Jotai atom that manages the state of the currently
// selected tab in the baby tracking application.
// It derives the list of available tabs from the configuration, initializes the
// selected tab to the first one,
// and provides a derived atom that returns both the tab name and its
// associated configuration.
// This enables components to access tab-specific settings and dynamically
// update the UI based on the selected tab.

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
