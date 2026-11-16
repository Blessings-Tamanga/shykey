import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Mascot, Screen, ScreenHeader } from '../components';
import { useShykey } from '../hooks/useShykey';

export function CheckinPage() {
  const { checkIn, loadMission } = useShykey();
  const navigate = useNavigate();
  const [notYet, setNotYet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function shrinkMission() {
    setSaving(true);
    setError('');
    try {
      await checkIn('not_yet');
      await loadMission(true);
      navigate('/mission');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save your check-in. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function finish(outcome: 'done' | 'partial') {
    setSaving(true);
    setError('');
    try {
      await checkIn(outcome);
      navigate('/win');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not save your check-in. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <ScreenHeader />
      <p className="eyebrow checkin-label">Next-day check-in (shown now so you can try it)</p>
      <h1 className="big">{notYet ? 'No shame. Smaller tomorrow.' : 'Did you do it?'}</h1>
      <div className="stage"><Mascot size={180} /></div>
      {notYet ? (
        <>
          <Button disabled={saving} onClick={() => void shrinkMission()}>{saving ? 'Saving…' : 'Make it smaller'}</Button>
          <Button variant="ghost" disabled={saving} onClick={() => navigate('/')}>Back home</Button>
        </>
      ) : (
        <div className="checkin-options">
          <Button disabled={saving} onClick={() => void finish('done')}>Yes, I did it</Button>
          <Button variant="option" disabled={saving} onClick={() => void finish('partial')}>Kind of</Button>
          <Button variant="ghost" disabled={saving} onClick={() => setNotYet(true)}>Not yet</Button>
        </div>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
    </Screen>
  );
}
