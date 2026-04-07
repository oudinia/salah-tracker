import { PRAYERS } from "../lib/types";
import type { DayRecord, PrayerName } from "../lib/types";
import { PrayerRow } from "./PrayerRow";

interface TodayCardProps {
  record: DayRecord;
  onTapFard: (prayer: PrayerName) => void;
  onTapSunnah: (prayer: PrayerName) => void;
  onExtraChange: (delta: number) => void;
}

export function TodayCard({ record, onTapFard, onTapSunnah, onExtraChange }: TodayCardProps) {
  const doneCount = PRAYERS.filter((p) => record.prayers[p].fard).length;
  const dayName = new Date(record.date + "T12:00:00").toLocaleDateString("en", { weekday: "long" });
  const dateStr = new Date(record.date + "T12:00:00").toLocaleDateString("en", { month: "short", day: "numeric" });
  const extra = record.extra || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">{dayName}</h2>
          <p className="text-sm text-gray-400">{dateStr}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`text-2xl font-bold ${doneCount === 5 ? "text-emerald-600" : "text-gray-800"}`}>
            {doneCount}
          </span>
          <span className="text-sm text-gray-400">/ 5</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-5 mb-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${doneCount === 5 ? "bg-emerald-500" : "bg-emerald-400"}`}
          style={{ width: `${(doneCount / 5) * 100}%` }}
        />
      </div>

      <div className="px-4 pb-2 divide-y divide-gray-50">
        {PRAYERS.map((p) => (
          <PrayerRow
            key={p}
            prayer={p}
            entry={record.prayers[p]}
            onTapFard={() => onTapFard(p)}
            onTapSunnah={() => onTapSunnah(p)}
          />
        ))}
      </div>

      {/* Extra nawafil */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-700">Extra Nawafil</span>
            <p className="text-xs text-gray-400">Beyond sunnah ratibah</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onExtraChange(-1)}
              disabled={extra <= 0}
              className="w-8 h-8 rounded-lg bg-gray-200 text-gray-600 font-bold text-lg flex items-center justify-center hover:bg-gray-300 active:scale-90 transition-all disabled:opacity-30"
            >
              -
            </button>
            <span className="text-lg font-bold text-violet-600 w-8 text-center">{extra}</span>
            <button
              onClick={() => onExtraChange(1)}
              className="w-8 h-8 rounded-lg bg-violet-500 text-white font-bold text-lg flex items-center justify-center hover:bg-violet-600 active:scale-90 transition-all"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
