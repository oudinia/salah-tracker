import { useState } from "react";
import { PRAYERS, PRAYER_LABELS } from "../lib/types";
import type { DayRecord, PrayerName } from "../lib/types";
import { PrayerRow } from "./PrayerRow";

interface HistoryViewProps {
  days: DayRecord[];
  onToggle: (date: string, prayer: PrayerName) => void;
  onMakeUp: (date: string, prayer: PrayerName) => void;
}

function formatDayHeader(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
}

export function HistoryView({ days, onToggle, onMakeUp }: HistoryViewProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  // Show most recent first, skip today (already shown in TodayCard)
  const pastDays = [...days].reverse().slice(1);

  if (pastDays.length === 0) {
    return (
      <div className="text-center text-sm text-gray-400 py-8">
        Start tracking today. Past days will appear here.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-lg font-bold text-gray-900">History</h2>
        <p className="text-sm text-gray-400">Tap a day to expand and make up missed prayers</p>
      </div>

      <div className="divide-y divide-gray-50">
        {pastDays.map((day) => {
          const isExpanded = expanded === day.date;
          const doneCount = PRAYERS.filter(
            (p) => day.prayers[p] === "done" || day.prayers[p] === "made_up"
          ).length;
          const hasMissed = PRAYERS.some((p) => day.prayers[p] === "missed");

          return (
            <div key={day.date}>
              <button
                onClick={() => setExpanded(isExpanded ? null : day.date)}
                className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    {formatDayHeader(day.date)}
                  </span>
                  {hasMissed && (
                    <span className="text-xs px-1.5 py-0.5 rounded-md bg-red-50 text-red-500 font-medium">
                      {PRAYERS.filter((p) => day.prayers[p] === "missed").length} missed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {PRAYERS.map((p) => (
                      <div
                        key={p}
                        className={`w-2 h-2 rounded-full ${
                          day.prayers[p] === "done"
                            ? "bg-emerald-500"
                            : day.prayers[p] === "made_up"
                            ? "bg-blue-500"
                            : "bg-red-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{doneCount}/5</span>
                  <span className={`text-gray-300 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                    ▾
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 bg-gray-50/50">
                  {PRAYERS.map((p) => (
                    <PrayerRow
                      key={p}
                      prayer={p}
                      status={day.prayers[p]}
                      onToggle={() => onToggle(day.date, p)}
                      onMakeUp={day.prayers[p] === "missed" ? () => onMakeUp(day.date, p) : undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
