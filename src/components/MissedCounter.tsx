interface MissedCounterProps {
  rawMissed: number;
  extraCredit: number;
  netDebt: number;
}

export function MissedCounter({ rawMissed, extraCredit, netDebt }: MissedCounterProps) {
  if (netDebt === 0 && rawMissed === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 text-center">
        <div className="text-2xl mb-1">🤲</div>
        <p className="text-sm font-semibold text-emerald-700">All prayers accounted for</p>
        <p className="text-xs text-emerald-500 mt-0.5">No missed prayers to make up</p>
      </div>
    );
  }

  if (netDebt === 0 && rawMissed > 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 text-center">
        <div className="text-2xl mb-1">🤲</div>
        <p className="text-sm font-semibold text-blue-700">Qada debt cleared</p>
        <p className="text-xs text-blue-500 mt-0.5">
          {rawMissed} missed — {extraCredit} nawafil credited
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-center">
      <div className="text-3xl font-bold text-amber-600">{netDebt}</div>
      <p className="text-sm font-medium text-amber-700 mt-1">prayers to make up</p>
      {extraCredit > 0 && (
        <p className="text-xs text-blue-500 mt-1">
          {extraCredit} nawafil credited ({rawMissed} missed total)
        </p>
      )}
      <p className="text-xs text-amber-500 mt-0.5">
        Pray extra nawafil or mark past prayers as made up
      </p>
    </div>
  );
}
