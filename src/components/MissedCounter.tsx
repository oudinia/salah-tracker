interface MissedCounterProps {
  count: number;
}

export function MissedCounter({ count }: MissedCounterProps) {
  if (count === 0) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 text-center">
        <div className="text-2xl mb-1">🤲</div>
        <p className="text-sm font-semibold text-emerald-700">All prayers accounted for</p>
        <p className="text-xs text-emerald-500 mt-0.5">No missed prayers to make up</p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 text-center">
      <div className="text-3xl font-bold text-amber-600">{count}</div>
      <p className="text-sm font-medium text-amber-700 mt-1">prayers to make up</p>
      <p className="text-xs text-amber-500 mt-0.5">
        Scroll down to past days to mark them as made up
      </p>
    </div>
  );
}
