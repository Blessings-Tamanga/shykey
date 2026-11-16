import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, ICONS, Mascot, Screen } from '../components';
import { COACH_OPENING, COACH_STARTERS } from '../data/mockData';
import { useShykey } from '../hooks/useShykey';

interface Message {
  from: 'coach' | 'you';
  text: string;
}

export function ChatPage() {
  const { services, selectMode, loadMission } = useShykey();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([{ from: 'coach', text: COACH_OPENING }]);
  const [value, setValue] = useState('');
  const [turn, setTurn] = useState(0);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || sending) return;
    const nextTurn = turn + 1;
    setTurn(nextTurn);
    setMessages((current) => [...current, { from: 'you', text: text.trim() }]);
    setValue('');
    setSending(true);
    setError('');
    try {
      const reply = await services.sendCoachMessage(conversationId, text.trim(), nextTurn);
      setConversationId(reply.conversationId);
      setMessages((current) => [...current, { from: 'coach', text: reply.text }]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The coach could not reply. Please try again.');
    } finally {
      setSending(false);
    }
  }

  async function openMission() {
    selectMode('professional');
    await loadMission(false, 'professional');
    navigate('/mission');
  }

  return (
    <Screen className="chat-screen">
      <div className="top chat-header">
        <div className="coach-identity"><Mascot size={40} /><b>Coach</b></div>
        <Button className="icon-button" variant="icon" onClick={() => navigate('/app')} aria-label="Close chat"><Icon path={ICONS.close} /></Button>
      </div>
      <div className="chat-messages" aria-live="polite">
        {messages.map((message, index) => <div key={index} className={`bubble ${message.from}`}>{message.text}</div>)}
        {sending && <div className="bubble coach">Thinking…</div>}
        <div ref={end} />
      </div>
      {turn === 0 && (
        <div className="chips">
          {COACH_STARTERS.map((starter) => <Button key={starter} variant="chip" onClick={() => void send(starter)}>{starter}</Button>)}
        </div>
      )}
      {turn > 3 && (
        <div className="chips">
          <Button variant="chip" onClick={() => void openMission()}>Turn it into a mission</Button>
          <Button variant="chip" onClick={() => setMessages((current) => [...current, { from: 'coach', text: 'Send me your own version first. I’ll edit it so it still sounds like you.' }])}>Draft it for me</Button>
        </div>
      )}
      {error && <p className="form-error" role="alert">{error}</p>}
      <form className="input-row chat-input" onSubmit={(event) => { event.preventDefault(); void send(value); }}>
        <input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Type here" aria-label="Message" />
        <Button type="submit" disabled={sending}>Send</Button>
      </form>
    </Screen>
  );
}
