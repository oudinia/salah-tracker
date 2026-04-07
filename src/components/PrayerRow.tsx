import type { PrayerName, PrayerEntry } from "../lib/types";
import { PRAYER_LABELS, PRAYER_TIMES, SUNNAH_RATIBAH } from "../lib/types";

interface PrayerRowProps {
  prayer: PrayerName;
  entry: PrayerEntry;
  onTapFard: () => void;
  onTapSunnah?: () => void;
  compact?: boolean;
}

function sunnahLabel(prayer: PrayerName): string | null {
  const s = SUNNAH_RATIBAH[prayer];
  if (!s) return null;
  const parts: string[] = [];
  if (s.before) parts.push(`${s.before} before`);
  if (s.after) parts.push(`${s.after} after`);
  return parts.join(", ");
}

export function PrayerRow({ prayer, entry, onTapFard, onTapSunnah, compact }: PrayerRowProps) {
  const hasSunnah = !!SUNNAH_RATIBAH[prayer];

  if (compact) {
    return (
      <button
        onClick={onTapFard}
        className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-all active:scale-90 ${
          entry.fard
            ? "bg-emerald-500 text-white"
            : "bg-gray-100 text-gray-300 border border-gray-200"
        }`}
        title={`${PRAYER_LABELS[prayer]}: ${entry.fard ? "done" : "not yet"}`}
      >
        {entry.fard ? "✓" : ""}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="flex flex-col">
        <span className="font-semibold text-[15px] text-gray-800">{PRAYER_LABELS[prayer]}</span>
        <span className="text-xs text-gray-400">{PRAYER_TIMES[prayer]}</span>
      </div>
      <div className="flex items-center gap-2">
        {/* Sunnah toggle */}
        {hasSunnah && onTapSunnah && (
          <button
            onClick={onTapSunnah}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all active:scale-95 ${
              entry.sunnah
                ? "bg-violet-100 text-violet-600 border border-violet-200"
                : "bg-gray-50 text-gray-400 border border-gray-100"
            }`}
            title={`Sunnah: ${sunnahLabel(prayer)}`}
          >
            {entry.sunnah ? "Sunnah ✓" : "Sunnah"}
          </button>
        )}

        {/* Fard toggle */}
        <button
          onClick={onTapFard}
          className={`w-11 h-11 rounded-xl text-base font-bold flex items-center justify-center transition-all active:scale-90 ${
            entry.fard
              ? "bg-emerald-500 text-white shadow-sm shadow-emerald-200"
              : "bg-gray-100 text-gray-300 border border-gray-200"
          }`}
        >
          {entry.fard ? "✓" : ""}
        </button>
      </div>
    </div>
  );
}
