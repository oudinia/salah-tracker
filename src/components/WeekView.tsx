import { PRAYERS, PRAYER_LABELS } from "../lib/types";
import type { DayRecord, PrayerName } from "../lib/types";
import { PrayerRow } from "./PrayerRow";

interface WeekViewProps {
  days: DayRecord[];
  stats: { fardTotal: number; fardDone: number; fardNotDone: number; sunnahDone: number; completionRate: number };
  onTapFard: (date: string, prayer: PrayerName) => void;
}

function shortDay(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en", { weekday: "short" });
}

function shortDate(dateStr: string): string {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en", { day: "numeric" });
}

export function WeekView({ days, stats, onTapFard }: WeekViewProps) {
  const pct = Math.round(stats.completionRate * 100);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">This Week</h2>
          <p className="text-sm text-gray-400">
            {stats.fardDone} of {stats.fardTotal} fard
            {stats.sunnahDone > 0 && ` · ${stats.sunnahDone} sunnah`}
          </p>
        </div>
        <div className={`text-2xl font-bold ${pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-500" : "text-gray-400"}`}>
          {pct}%
        </div>
      </div>

      <div className="px-4 pb-4 overflow-x-auto">
        <table className="w-full text-center text-sm">
          <thead>
            <tr>
              <th className="text-left text-xs text-gray-400 font-medium pb-2 pr-2 w-16"></th>
              {days.map((d) => (
                <th key={d.date} className="pb-2 text-xs font-medium text-gray-400 min-w-[44px]">
                  <div>{shortDay(d.date)}</div>
                  <div className="text-gray-300">{shortDate(d.date)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRAYERS.map((prayer) => (
              <tr key={prayer}>
                <td className="text-left text-xs text-gray-500 font-medium py-1.5 pr-2">
                  {PRAYER_LABELS[prayer]}
                </td>
                {days.map((d) => (
                  <td key={d.date} className="py-1.5">
                    <div className="flex justify-center">
                      <PrayerRow
                        prayer={prayer}
                        entry={d.prayers[prayer]}
                        onTapFard={() => onTapFard(d.date, prayer)}
                        compact
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
