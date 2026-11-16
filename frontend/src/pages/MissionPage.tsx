import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Mascot, Screen, ScreenHeader } from '../components';
import { MODES } from '../data/mockData';
import { useShykey } from '../hooks/useShykey';

export function MissionPage() {
  const { modeKey, mission, smallMission, setSmallMission, loadMission, commitMission } = useShykey();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [committing, setCommitting] = useState(false);
  const [error, setError] = useState('');
  const mode = MODES.find((item) => item.key === modeKey) ?? MODES[2];

  useEffect(() => {
    if (!mission || mission.modeKey !== modeKey || (mission.variant === 'small') !== smallMission) {
      void loadMission(smallMission);
    }
  }, [mission, modeKey, smallMission, loadMission]);

  const task = mission?.task ?? mode.task;
  const labels = ['Today’s mission', 'Why this works', 'Your plan'];
  const body = [task, mode.why, task];

  function makeSmaller() {
    setSmallMission(!smallMission);
  }

  async function advance() {
    if (step < 2) {
      setStep(step + 1);
      return;
    }
    setCommitting(true);
    setError('');
    try {
      await commitMission();
      navigate('/checkin');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save your mission. Please try again.');
    } finally {
      setCommitting(false);
    }
  }

  return (
    <Screen>
      <ScreenHeader />
      <div className="mission-copy" style={{ marginTop: 22 }}>
        <p className="eyebrow">{labels[step]}</p>
        <h1 className={step === 1 ? 'mission-why' : 'big'}>{body[step]}</h1>
      </div>
      <div className="stage">
        <div className="glow" style={{ background: mode.color }} />
        <Mascot size={200} happy={step === 2} />
      </div>
      <div className="dots" aria-label={`Step ${step + 1} of 3`}>
        {[0, 1, 2].map((item) => <i key={item} className={item === step ? 'active' : ''} />)}
      </div>
      {step === 1 && (
        <Button variant="ghost" onClick={makeSmaller}>
          {smallMission ? 'Use the full version' : 'Make it smaller'}
        </Button>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      <Button onClick={() => void advance()} disabled={committing}>
        {committing ? 'Saving…' : step < 2 ? 'Next' : 'I’ll do it today'}
      </Button>
    </Screen>
  );
}
