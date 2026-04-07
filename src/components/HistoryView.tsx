import { useState } from "react";
import { PRAYERS, PRAYER_LABELS, SUNNAH_RATIBAH } from "../lib/types";
import type { DayRecord, PrayerName } from "../lib/types";
import { PrayerRow } from "./PrayerRow";

interface HistoryViewProps {
  days: DayRecord[];
  onTapFard: (date: string, prayer: PrayerName) => void;
  onTapSunnah: (date: string, prayer: PrayerName) => void;
}

function formatDayHeader(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" });
}

export function HistoryView({ days, onTapFard, onTapSunnah }: HistoryViewProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const pastDays = [...days].reverse().slice(1);

  if (pastDays.length === 0) {
    return (
      <div className="text-center text-sm text-gray-400 py-8">
        Past days will appear here tomorrow.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-lg font-bold text-gray-900">Past Days</h2>
        <p className="text-sm text-gray-400">Tap to expand and update</p>
      </div>

      <div className="divide-y divide-gray-50">
        {pastDays.map((day) => {
          const isExpanded = expanded === day.date;
          const doneCount = PRAYERS.filter((p) => day.prayers[p].fard).length;

          return (
            <div key={day.date}>
              <button
                onClick={() => setExpanded(isExpanded ? null : day.date)}
                className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  {formatDayHeader(day.date)}
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {PRAYERS.map((p) => (
                      <div
                        key={p}
                        className={`w-2 h-2 rounded-full ${
                          day.prayers[p].fard ? "bg-emerald-500" : "bg-gray-200"
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
                      entry={day.prayers[p]}
                      onTapFard={() => onTapFard(day.date, p)}
                      onTapSunnah={() => onTapSunnah(day.date, p)}
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
