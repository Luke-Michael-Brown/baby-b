export interface Entry {
  id: string;
  start_time: string;
  end_time?: string;
  isShown?: boolean;
  [key: string]: string | boolean | number | undefined;
}

export interface BabyData {
  [tab: string]: Entry[];
}

export interface BabiesData {
  [babyName: string]: BabyData;
}
