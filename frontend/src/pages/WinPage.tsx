import { useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Mascot, Screen } from '../components';
import { useShykey } from '../hooks/useShykey';

const CONFETTI_COLORS = ['#FF6A13', '#8FD19A', '#F4C0DA', '#B6CFE8'];

export function WinPage() {
  const { stats, services } = useShykey();
  const navigate = useNavigate();
  const [offer, setOffer] = useState<'closed' | 'details' | 'email' | 'success'>('closed');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const confetti = useMemo(
    () => Array.from({ length: 22 }, (_, index) => ({
      left: `${Math.random() * 100}%`,
      background: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
      animationDelay: `${index * 0.08}s`,
    })),
    [],
  );

  async function joinList(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    try {
      await services.joinWaitlist(email.trim());
      setOffer('success');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not join the list. Please try again.');
    }
  }

  return (
    <Screen className="win-screen">
      <div className="confetti" aria-hidden="true">{confetti.map((piece, index) => <i key={index} style={piece} />)}</div>
      <p className="eyebrow win-label">Rep logged</p>
      <div className="big-number"><Flame />{stats.streak}</div>
      <h2 className="win-title">day streak. That’s real-world courage.</h2>
      <div className="stage"><Mascot size={170} happy /></div>
      <Button className="offer-button" onClick={() => setOffer('details')}>See the 6-week program</Button>
      <Button variant="ghost" onClick={() => navigate('/')}>Back home</Button>
      {offer !== 'closed' && (
        <div className="offer-overlay" onClick={() => setOffer('closed')}>
          <section className="offer-sheet" role="dialog" aria-modal="true" aria-labelledby="offer-title" onClick={(event) => event.stopPropagation()}>
            {offer === 'details' ? (
              <>
                <h2 id="offer-title">6 weeks to talking like yourself</h2>
                <ul>
                  <li>A graded mission every day</li>
                  <li>Check-ins that notice your progress</li>
                  <li>Support that fades as you grow</li>
                </ul>
                <Button onClick={() => setOffer('email')}>Join the early list</Button>
              </>
            ) : offer === 'email' ? (
              <>
                <h2 id="offer-title">Join the early list</h2>
                <p className="eyebrow offer-description">The program isn’t live yet. Leave an email and we’ll tell you first.</p>
                <form className="input-row" onSubmit={(event) => void joinList(event)}>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@email.com" type="email" required aria-label="Email" />
                  <Button type="submit">Save</Button>
                </form>
                {error && <p className="form-error" role="alert">{error}</p>}
              </>
            ) : (
              <>
                <h2 id="offer-title">You’re on the list.</h2>
                <p className="eyebrow offer-description">The program isn’t live yet. We’ll tell you first.</p>
                <Button onClick={() => setOffer('closed')}>Done</Button>
              </>
            )}
          </section>
        </div>
      )}
    </Screen>
  );
}

function Flame() {
  return (
    <svg aria-hidden="true" width="52" height="64" viewBox="0 0 20 24">
      <path d="M10 0c1 5 8 8 8 15a8 8 0 0 1-16 0c0-3 2-5 3-7 1 2 2 3 3 3 0-4-1-6 2-11z" fill="var(--flame)" />
    </svg>
  );
}
