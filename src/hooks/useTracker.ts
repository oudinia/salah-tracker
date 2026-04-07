import { useState, useCallback } from "react";
import {
  getDay,
  getAllDays,
  toggleFard,
  toggleSunnah,
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
  const debt = getQadaDebt();
  const weekStats = getStats(weekDays);
  const allTimeStats = getStats(allDays);

  const tapFard = useCallback((date: string, prayer: PrayerName) => {
    toggleFard(date, prayer);
    bump();
  }, []);

  const tapSunnah = useCallback((date: string, prayer: PrayerName) => {
    toggleSunnah(date, prayer);
    bump();
  }, []);

  const addExtra = useCallback((date: string, delta: number) => {
    const day = getDay(date);
    setExtraPrayers(date, (day.extra || 0) + delta);
    bump();
  }, []);

  void revision;

  return {
    today,
    todayRecord,
    allDays,
    weekDays,
    debt,
    weekStats,
    allTimeStats,
    tapFard,
    tapSunnah,
    addExtra,
  };
}
