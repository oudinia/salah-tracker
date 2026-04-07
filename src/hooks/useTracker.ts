import { useState, useCallback } from "react";
import {
  getDay,
  getAllDays,
  cyclePrayerStatus,
  markMadeUp,
  getStats,
  getMissedCount,
  getCurrentWeekDays,
  formatDate,
} from "../lib/storage";
import type { DayRecord, PrayerName } from "../lib/types";

export function useTracker() {
  const [revision, setRevision] = useState(0);
  const bump = () => setRevision((r) => r + 1);

  const today = formatDate(new Date());
  const todayRecord = getDay(today);
  const allDays = getAllDays();
  const weekDays = getCurrentWeekDays();
  const missedCount = getMissedCount();
  const weekStats = getStats(weekDays);
  const allTimeStats = getStats(allDays);

  const toggle = useCallback((date: string, prayer: PrayerName) => {
    cyclePrayerStatus(date, prayer);
    bump();
  }, []);

  const makeUp = useCallback((date: string, prayer: PrayerName) => {
    markMadeUp(date, prayer);
    bump();
  }, []);

  // Force re-read on revision change
  void revision;

  return {
    today,
    todayRecord,
    allDays,
    weekDays,
    missedCount,
    weekStats,
    allTimeStats,
    toggle,
    makeUp,
  };
}
