import type { PrayerName, PrayerStatus } from "../lib/types";
import { PRAYER_LABELS, PRAYER_TIMES } from "../lib/types";

interface PrayerRowProps {
  prayer: PrayerName;
  status: PrayerStatus;
  onToggle: () => void;
  onMakeUp?: () => void;
  compact?: boolean;
}

const STATUS_STYLES: Record<PrayerStatus, string> = {
  done: "bg-emerald-500 text-white",
  missed: "bg-red-100 text-red-600 border border-red-200",
  made_up: "bg-blue-500 text-white",
};

const STATUS_ICONS: Record<PrayerStatus, string> = {
  done: "✓",
  missed: "✕",
  made_up: "↻",
};

export function PrayerRow({ prayer, status, onToggle, onMakeUp, compact }: PrayerRowProps) {
  if (compact) {
    return (
      <button
        onClick={onToggle}
        className={`w-9 h-9 rounded-full text-sm font-bold flex items-center justify-center transition-all active:scale-90 ${STATUS_STYLES[status]}`}
        title={`${PRAYER_LABELS[prayer]}: ${status}`}
      >
        {STATUS_ICONS[status]}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between py-3 px-1">
      <div className="flex flex-col">
        <span className="font-semibold text-[15px]">{PRAYER_LABELS[prayer]}</span>
        <span className="text-xs text-gray-400">{PRAYER_TIMES[prayer]}</span>
      </div>
      <div className="flex items-center gap-2">
        {status === "missed" && onMakeUp && (
          <button
            onClick={onMakeUp}
            className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 font-medium hover:bg-blue-100 transition-colors"
          >
            Make up
          </button>
        )}
        <button
          onClick={onToggle}
          className={`w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all active:scale-90 ${STATUS_STYLES[status]}`}
        >
          {STATUS_ICONS[status]}
        </button>
      </div>
    </div>
  );
}
