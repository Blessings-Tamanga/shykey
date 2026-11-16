import { useNavigate } from 'react-router-dom';
import { Button, Screen, ScreenHeader } from '../components';
import { MODES } from '../data/mockData';
import { useShykey } from '../hooks/useShykey';
import { useTheme } from '../hooks/useTheme';

export function ProfilePage() {
  const { stats, resetDemo } = useShykey();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  function reset() {
    resetDemo();
    navigate('/app');
  }

  return (
    <Screen>
      <ScreenHeader />
      <h1 className="profile-title">Your reps</h1>
      <div className="stats-grid">
        <div className="stat"><b>{stats.streak}</b><small>Current streak</small></div>
        <div className="stat"><b>{stats.best}</b><small>Best streak</small></div>
        <div className="stat"><b>{stats.reps}</b><small>Missions done</small></div>
        <div className="stat"><b>{MODES.length}</b><small>Modes unlocked</small></div>
      </div>
      <div className="mode-tags">{MODES.map((mode) => <span className="tag" style={{ background: mode.color }} key={mode.key}>{mode.name}</span>)}</div>
      <div className="fill-space" />
      <Button variant="option" onClick={toggleTheme}>Switch to {dark ? 'light' : 'dark'} mode</Button>
      <Button variant="ghost" onClick={reset}>Reset demo data</Button>
    </Screen>
  );
}
