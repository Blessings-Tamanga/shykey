import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Screen, ScreenHeader } from '../components';
import { useShykey } from '../hooks/useShykey';
import type { ReadingResult } from '../types';

export function ReadPage() {
  const { services, selectMode, loadMission } = useShykey();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function read(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');
    try {
      setResult(await services.readMessage(text.trim()));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not read that message. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function startMission() {
    selectMode('emotions');
    await loadMission(false);
    navigate('/mission');
  }

  return (
    <Screen>
      <ScreenHeader />
      <h1 className="read-title">{result ? 'Here are 3 readings' : 'Paste a message'}</h1>
      {!result ? (
        <form className="read-form" onSubmit={(event) => void read(event)}>
          <textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste what they sent" aria-label="Message to read" maxLength={2000} />
          <p className="note">Text stays in this demo and is not sent to a service.</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="fill-space" />
          <Button type="submit" disabled={!text.trim() || loading}>{loading ? 'Reading…' : 'Read it'}</Button>
        </form>
      ) : (
        <div className="reading-results">
          {result.readings.map((reading) => (
            <div className="reading-card" key={reading.label}>
              <b>{reading.label}<span className={`support ${reading.support}`}>{supportLabel(reading.support)}</span></b>
              <span className={`support-bar ${reading.support}`}><i /></span>
              <p>{reading.explanation}</p>
            </div>
          ))}
          <p className="note">What would settle it: {result.whatWouldSettleIt} Sample readings only; AI connects later.</p>
          <Button className="reading-mission" onClick={() => void startMission()}>Turn this into a mission</Button>
        </div>
      )}
    </Screen>
  );
}

function supportLabel(support: ReadingResult['readings'][number]['support']) {
  if (support === 'most_supported') return 'Most supported';
  if (support === 'plausible') return 'Plausible';
  return 'Least supported';
}
