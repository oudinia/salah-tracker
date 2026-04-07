interface DebtBannerProps {
  notDone: number;
  sunnahCredits: number;
  extraCredits: number;
  netDebt: number;
}

export function DebtBanner({ notDone, sunnahCredits, extraCredits, netDebt }: DebtBannerProps) {
  const totalCredits = sunnahCredits + extraCredits;

  // All fard prayed, no debt at all
  if (notDone === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-5 py-4 text-center">
        <p className="text-sm font-semibold text-emerald-700">All prayers done</p>
        {totalCredits > 0 && (
          <p className="text-xs text-emerald-500 mt-0.5">
            + {totalCredits} nawafil prayed
          </p>
        )}
      </div>
    );
  }

  // Debt cleared by nawafil
  if (netDebt === 0) {
    return (
      <div className="bg-sky-50 border border-sky-100 rounded-2xl px-5 py-4 text-center">
        <p className="text-sm font-semibold text-sky-700">Nawafil cover your balance</p>
        <p className="text-xs text-sky-500 mt-0.5">
          {notDone} not yet done — {totalCredits} nawafil credited
        </p>
      </div>
    );
  }

  // Some debt remaining — gentle tone
  return (
    <div className="bg-amber-50/70 border border-amber-100 rounded-2xl px-5 py-4 text-center">
      <div className="text-2xl font-bold text-amber-600">{netDebt}</div>
      <p className="text-sm font-medium text-amber-700 mt-0.5">to make up</p>
      {totalCredits > 0 && (
        <p className="text-xs text-amber-500 mt-1">
          {totalCredits} nawafil credited of {notDone} total
        </p>
      )}
    </div>
  );
}
