import { useState } from "react";
import { useTracker } from "./hooks/useTracker";
import { TodayCard } from "./components/TodayCard";
import { WeekView } from "./components/WeekView";
import { MissedCounter } from "./components/MissedCounter";
import { HistoryView } from "./components/HistoryView";

type Tab = "today" | "week" | "history";

function App() {
  const [tab, setTab] = useState<Tab>("today");
  const tracker = useTracker();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-emerald-700 text-white px-5 pt-6 pb-12 text-center">
        <h1 className="text-xl font-bold tracking-tight">Salah Tracker</h1>
        <p className="text-emerald-200 text-sm mt-0.5">Track. Make up. Stay consistent.</p>
      </header>

      {/* Tab bar */}
      <nav className="flex justify-center -mt-5 mb-4 px-4">
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 gap-1">
          {(["today", "week", "history"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "today" ? "Today" : t === "week" ? "Week" : "History"}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 pb-8 space-y-4">
        {/* Missed counter - always visible */}
        <MissedCounter count={tracker.missedCount} />

        {tab === "today" && (
          <TodayCard
            record={tracker.todayRecord}
            onToggle={(prayer) => tracker.toggle(tracker.today, prayer)}
            onMakeUp={(prayer) => tracker.makeUp(tracker.today, prayer)}
          />
        )}

        {tab === "week" && (
          <WeekView
            days={tracker.weekDays}
            stats={tracker.weekStats}
            onToggle={tracker.toggle}
          />
        )}

        {tab === "history" && (
          <HistoryView
            days={tracker.allDays}
            onToggle={tracker.toggle}
            onMakeUp={tracker.makeUp}
          />
        )}
      </main>
    </div>
  );
}

export default App;
