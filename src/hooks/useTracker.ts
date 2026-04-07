import { useState, useCallback } from "react";
import {
  getDay,
  getAllDays,
  cyclePrayerStatus,
  markMadeUp,
  setExtraPrayers,
  getStats,
  getQadaDebt,
  getCurrentWeekDays,
  formatDate,
} from "../lib/storage";
import type { PrayerName } from "../lib/types";

export function useTracker() {
  const [revision, setRevision] = useState(0);
  const bump = () => setRevision((r) => r + 1);

  const today = formatDate(new Date());
  const todayRecord = getDay(today);
  const allDays = getAllDays();
  const weekDays = getCurrentWeekDays();
  const qadaDebt = getQadaDebt();
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

  const addExtra = useCallback((date: string, delta: number) => {
    const day = getDay(date);
    setExtraPrayers(date, (day.extra || 0) + delta);
    bump();
  }, []);

  // Force re-read on revision change
  void revision;

  return {
    today,
    todayRecord,
    allDays,
    weekDays,
    qadaDebt,
    weekStats,
    allTimeStats,
    toggle,
    makeUp,
    addExtra,
  };
}
