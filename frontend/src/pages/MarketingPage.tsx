import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faBolt,
  faCheck,
  faCircleCheck,
  faHeart,
  faRotate,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MODES } from '../data/mockData';
import { useShykey } from '../hooks/useShykey';
import type { ModeKey } from '../types';
import '../styles/marketing.css';

const MODE_IMAGES = [
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=85',
];

const FEATURE_CARDS: {
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  modeKey: ModeKey;
}[] = [
  {
    label: MODES[0].name,
    title: MODES[0].title,
    description: MODES[0].description,
    image: MODE_IMAGES[0],
    imageAlt: 'Coworkers talking together around a table',
    modeKey: 'professional',
  },
  {
    label: MODES[1].name,
    title: MODES[1].title,
    description: MODES[1].description,
    image: MODE_IMAGES[1],
    imageAlt: 'Friends talking together outdoors',
    modeKey: 'emotions',
  },
  {
    label: MODES[2].name,
    title: MODES[2].title,
    description: MODES[2].description,
    image: MODE_IMAGES[2],
    imageAlt: 'Friends spending time together',
    modeKey: 'flirting',
  },
];

export function MarketingPage() {
  const { services, selectMode, loadMission } = useShykey();
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(0);
  const [demoMode, setDemoMode] = useState(0);
  const [dialog, setDialog] = useState<'mode' | null>(null);
  const [cardOffset, setCardOffset] = useState(0);
  const [carouselHovered, setCarouselHovered] = useState(false);
  const [email, setEmail] = useState('');
  const [waitlistMessage, setWaitlistMessage] = useState('');
  const [waitlistError, setWaitlistError] = useState('');
  const [modeError, setModeError] = useState('');
  const [startingMode, setStartingMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (carouselHovered || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setCardOffset((current) => (current + 1) % FEATURE_CARDS.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [carouselHovered]);

  useEffect(() => {
    if (!dialog) return undefined;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setDialog(null);
    }
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [dialog]);

  const mode = MODES[activeMode];
  const demo = MODES[demoMode];
  const visibleFeatureCards = FEATURE_CARDS.map((card, index) => ({
    ...card,
    position: index === cardOffset ? 'front' : index === (cardOffset + 1) % FEATURE_CARDS.length ? 'right' : 'left',
  }));

  function openFeature(card: (typeof FEATURE_CARDS)[number]) {
    setActiveMode(MODES.findIndex((item) => item.key === card.modeKey));
    setDialog('mode');
  }

  async function startMode(modeKey: ModeKey) {
    setModeError('');
    setStartingMode(true);
    try {
      selectMode(modeKey);
      await loadMission(false, modeKey);
      setDialog(null);
      navigate('/mission');
    } catch (error) {
      setModeError(error instanceof Error ? error.message : 'We could not load that practice. Please try again.');
    } finally {
      setStartingMode(false);
    }
  }

  async function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setWaitlistMessage('');
    setWaitlistError('');
    setSubmitting(true);
    try {
      await services.joinWaitlist(email.trim());
      setEmail('');
      setWaitlistMessage('Thanks for trying the waitlist. This demo does not send or save your email.');
    } catch (error) {
      setWaitlistError(error instanceof Error ? error.message : 'We could not submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="shykey-landing">
      <a className="landing-skip" href="#landing-content">Skip to content</a>
      <header className="landing-nav">
        <Link className="landing-brand" to="/" aria-label="Shykey home">
          <span className="landing-brand-mark">s</span> shykey
        </Link>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#how">How it works</a>
          <a href="#paths">Practice paths</a>
        </nav>
        <div className="landing-nav-actions">
          <Link className="landing-nav-demo" to="/app">Try the demo</Link>
          <a className="landing-button landing-button-primary landing-button-small" href="#waitlist">
            Get an invite <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
          </a>
        </div>
      </header>

      <main id="landing-content">
        <section className="landing-hero landing-wrap" id="about">
          <div className="landing-hero-copy">
            <p className="landing-overline">A PRACTICE SPACE FOR REAL LIFE</p>
            <h1>Confidence,<br />one small rep. </h1>
            <p className="landing-lede">
              Small, real-world missions to help you practice showing up as yourself.
            </p>
            <div className="landing-hero-actions">
              <a className="landing-button landing-button-primary" href="#waitlist">
                Get an invite <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </a>
              <Link className="landing-button landing-button-secondary" to="/app">
                Try the demo <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="landing-hero-board" aria-label="Shykey app preview">
            <article className="preview-mission">
              <div className="preview-heading">
                <span className="preview-brand"><span className="landing-brand-mark">s</span> shykey</span>
                <FontAwesomeIcon icon={faBolt} aria-label="Today's practice" />
              </div>
              <p className="preview-caption">{demo.name} · today</p>
              <h2 aria-live="polite">{demo.task}</h2>
              <p>{demo.why}</p>
              <div className="preview-bottom">
                <span><FontAwesomeIcon icon={faCircleCheck} aria-hidden="true" /> Your pace, your call</span>
                <button type="button" onClick={() => setDemoMode((current) => (current + 1) % MODES.length)} aria-label="Show another mission">
                  <FontAwesomeIcon icon={faRotate} aria-hidden="true" />
                </button>
              </div>
            </article>
            <div className="preview-photo">
              <img src={MODE_IMAGES[1]} alt="Friends talking together outdoors" fetchPriority="high" />
              <span>Practice for the moments that matter.</span>
            </div>
            <article className="preview-checkin">
              <span className="preview-checkin-icon"><FontAwesomeIcon icon={faHeart} aria-hidden="true" /></span>
              <div><b>Check in kindly</b><span>Every attempt is useful.</span></div>
            </article>
          </div>
        </section>

        <section className="landing-proof landing-wrap" aria-label="Shykey practice paths">
          <span>Three ways to practice</span>
          {MODES.map((item) => <span className="proof-mode" key={item.key}>{item.name}</span>)}
        </section>

        <section className="landing-how landing-wrap" id="how">
          <div className="landing-section-heading">
            <div><h2>Small steps.<br />Real practice.</h2></div>
          </div>
          <div
            className="feature-carousel"
            id="paths"
            role="region"
            aria-roledescription="carousel"
            aria-label="Shykey practice examples"
            onMouseEnter={() => setCarouselHovered(true)}
            onMouseLeave={() => setCarouselHovered(false)}
            onFocusCapture={() => setCarouselHovered(true)}
            onBlurCapture={() => setCarouselHovered(false)}
          >
            <div className="feature-card-track" aria-live="off">
              {visibleFeatureCards.map((card) => (
                <article className={`feature-card is-${card.position}`} key={card.title} aria-roledescription="slide">
                  <img src={card.image} alt={card.imageAlt} loading="lazy" />
                  <div className="feature-card-shade" />
                  <div className="feature-card-copy">
                    <span>{card.label}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <button type="button" onClick={() => openFeature(card)}>
                      Explore this path
                      <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-video landing-wrap">
          <div className="landing-section-heading">
            <div><h2>See how Shykey works.</h2></div>
            <p>Watch the sample video. Replace it with Shykey’s own walkthrough when ready.</p>
          </div>
          <div className="landing-video-frame">
            <iframe
              src="https://www.youtube-nocookie.com/embed/aqz-KE-bpKQ?rel=0"
              title="Sample YouTube video placeholder for the Shykey walkthrough"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>

        <section className="landing-test landing-wrap" id="test-it">
          <div>
            <p className="landing-overline">TRY IT FOR YOURSELF</p>
            <h2>Start with one<br />small rep.</h2>
            <p>Explore the interactive prototype. No account needed.</p>
            <Link className="landing-button landing-button-light" to="/app">
              Test Shykey <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
            </Link>
          </div>
          <div className="test-preview">
            <span className="test-preview-mark"><span className="landing-brand-mark">s</span> shykey.app</span>
            <div className="test-preview-task"><FontAwesomeIcon icon={faBolt} aria-hidden="true" /><span>{demo.task}</span></div>
            <div className="test-preview-foot"><span>One doable step</span><FontAwesomeIcon icon={faCheck} aria-hidden="true" /></div>
          </div>
        </section>

        <section className="landing-waitlist" id="waitlist">
          <div className="landing-wrap waitlist-inner">
            <div>
              <p className="landing-overline">EARLY ACCESS</p>
              <h2>Get an invite.</h2>
              <p>Be first to try a more doable way to practice social confidence.</p>
            </div>
            <div>
              <form className="landing-waitlist-form" onSubmit={(event) => void submitWaitlist(event)}>
                <label className="landing-visually-hidden" htmlFor="waitlist-email">Email address</label>
                <input
                  id="waitlist-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <button className="landing-button landing-button-primary" type="submit" disabled={submitting}>
                  {submitting ? 'Joining…' : 'Get an invite'} <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
                </button>
              </form>
              {waitlistError && <p className="waitlist-feedback error" role="alert">{waitlistError}</p>}
              {waitlistMessage && <p className="waitlist-feedback" role="status">{waitlistMessage}</p>}
              <p className="waitlist-note">Demo only. Emails are not sent or stored.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer landing-wrap">
        <Link className="landing-brand" to="/"><span className="landing-brand-mark">s</span> shykey</Link>
        <span>Practice showing up as yourself.</span>
        <div><a href="#about">About</a><a href="#how">How it works</a><Link to="/app">Try the demo</Link></div>
      </footer>

      {dialog && (
        <div className="landing-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <section className="landing-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <button className="landing-dialog-close" type="button" onClick={() => setDialog(null)} aria-label="Close dialog">
              <FontAwesomeIcon icon={faXmark} aria-hidden="true" />
            </button>
            <div className="dialog-copy mode-dialog-copy" style={{ '--mode-color': mode.color } as CSSProperties}>
              <p className="dialog-step">{mode.name}</p>
              <h2 id="dialog-title">{mode.title}</h2>
              <p>{mode.description}</p>
              <div className="dialog-mission">{mode.task}<small>{mode.why}</small></div>
              <button className="landing-button landing-button-primary" type="button" onClick={() => void startMode(mode.key)} disabled={startingMode}>
                {startingMode ? 'Loading…' : 'Try this path'} <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </button>
              {modeError && <p className="waitlist-feedback error" role="alert">{modeError}</p>}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
