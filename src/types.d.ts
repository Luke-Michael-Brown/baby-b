// This file contains TypeScript type definitions that describe the core data
// structures used throughout the baby tracking application.
// It defines the Entry interface for individual log entries with timestamps and
// optional fields, BabyData for tab-specific arrays of entries,
// and BabiesData for a collection of baby data keyed by baby name.
// These types ensure type safety and consistency in data handling across
// components and hooks.

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
