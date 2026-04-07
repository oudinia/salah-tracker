import { useState } from "react";
import { useTracker } from "./hooks/useTracker";
import { TodayCard } from "./components/TodayCard";
import { WeekView } from "./components/WeekView";
import { DebtBanner } from "./components/MissedCounter";
import { HistoryView } from "./components/HistoryView";

type Tab = "today" | "week" | "history";

function App() {
  const [tab, setTab] = useState<Tab>("today");
  const tracker = useTracker();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-emerald-700 text-white px-5 pt-6 pb-12 text-center">
        <h1 className="text-xl font-bold tracking-tight">Salah Tracker</h1>
        <p className="text-emerald-200 text-sm mt-0.5">Track. Stay consistent.</p>
      </header>

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

      <main className="max-w-md mx-auto px-4 pb-8 space-y-4">
        <DebtBanner {...tracker.debt} />

        {tab === "today" && (
          <TodayCard
            record={tracker.todayRecord}
            onTapFard={(p) => tracker.tapFard(tracker.today, p)}
            onTapSunnah={(p) => tracker.tapSunnah(tracker.today, p)}
            onExtraChange={(d) => tracker.addExtra(tracker.today, d)}
          />
        )}

        {tab === "week" && (
          <WeekView
            days={tracker.weekDays}
            stats={tracker.weekStats}
            onTapFard={tracker.tapFard}
          />
        )}

        {tab === "history" && (
          <HistoryView
            days={tracker.allDays}
            onTapFard={tracker.tapFard}
            onTapSunnah={tracker.tapSunnah}
          />
        )}
      </main>
    </div>
  );
}

export default App;
