// This file defines a Jotai atom that manages the state of the currently
// selected baby in the application.
// The atom stores a string representing the baby's name or null if no baby is
// selected, allowing components to subscribe to changes in the selected baby
// and update the UI accordingly.
// This centralized state management facilitates dynamic rendering of
// baby-specific data across the app.

import { atom } from 'jotai';

export const selectedBaby = atom<string | null>(null);
export default selectedBaby;
