export const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
export type PrayerName = (typeof PRAYERS)[number];

export type PrayerStatus = "done" | "missed" | "made_up";

export interface DayRecord {
  date: string; // YYYY-MM-DD
  prayers: Record<PrayerName, PrayerStatus>;
  extra: number; // nawafil / extra prayers that count towards making up missed
}

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

export const PRAYER_TIMES: Record<PrayerName, string> = {
  fajr: "Dawn",
  dhuhr: "Midday",
  asr: "Afternoon",
  maghrib: "Sunset",
  isha: "Night",
};
