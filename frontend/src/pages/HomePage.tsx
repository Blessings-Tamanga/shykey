import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MODES } from '../data/mockData';
import { useShykey } from '../hooks/useShykey';
import { buzz } from '../utils/haptics';
import { Button, Icon, ICONS, Mascot, ModeCard, Screen, StreakWeek } from '../components';

export function HomePage() {
  const { stats, doneToday, selectMode, loadMission } = useShykey();
  const navigate = useNavigate();
  const carousel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = carousel.current;
    if (element) element.scrollLeft = (element.scrollWidth / 3) * 2;
  }, []);

  async function openMission(mode: (typeof MODES)[number]['key']) {
    buzz();
    selectMode(mode);
    await loadMission(false, mode);
    navigate('/mission');
  }

  return (
    <Screen className="home-screen">
      <div className="top">
        <Button className="streak-pill" variant="icon" onClick={() => navigate('/profile')} aria-label="View profile and streak">
          <Flame />
          {stats.streak}
        </Button>
        <Button className="avatar" variant="icon" onClick={() => navigate('/profile')} aria-label="Profile">🙂</Button>
      </div>
      <h1 className="big home-title">
        {doneToday ? 'Rep logged. See you tomorrow.' : `Day ${stats.streak + 1}. New day, new reps.`}
      </h1>
      <StreakWeek streak={stats.streak} doneToday={doneToday} />
      <div className="carousel" ref={carousel} aria-label="Choose a daily mode">
        {[MODES[2], MODES[0], MODES[1]].map((mode) => (
          <ModeCard
            key={mode.key}
            mode={mode}
            done={doneToday && mode.key === 'flirting'}
            onSelect={() => void openMission(mode.key)}
          />
        ))}
      </div>
      <div className="home-dock">
        <Link className="mascot-link" to="/chat" aria-label="Talk to coach"><Mascot size={64} /></Link>
        <div className="dock-actions">
          <Link className="icon-button" to="/read" aria-label="Read a message"><Icon path={ICONS.read} /></Link>
          <Link className="icon-button" to="/chat" aria-label="Chat with coach"><Icon path={ICONS.chat} /></Link>
        </div>
      </div>
    </Screen>
  );
}

function Flame() {
  return (
    <svg aria-hidden="true" width="20" height="24" viewBox="0 0 20 24">
      <path d="M10 0c1 5 8 8 8 15a8 8 0 0 1-16 0c0-3 2-5 3-7 1 2 2 3 3 3 0-4-1-6 2-11z" fill="var(--flame)" />
    </svg>
  );
}
