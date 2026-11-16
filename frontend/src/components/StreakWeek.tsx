interface StreakWeekProps {
  streak: number;
  doneToday: boolean;
}

export function StreakWeek({ streak, doneToday }: StreakWeekProps) {
  const today = new Date().getDay();
  return (
    <div className="week" aria-label="This week's activity">
      {['s', 'm', 't', 'w', 't', 'f', 's'].map((label, day) => {
        let state = '';
        if (day === today) state = doneToday ? 'complete' : 'current';
        else if (day < today) state = day >= today - (doneToday ? streak - 1 : streak) ? 'complete' : 'missed';
        return (
          <div key={`${label}-${day}`}>
            <i className={state} aria-label={state || 'upcoming'} />
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
