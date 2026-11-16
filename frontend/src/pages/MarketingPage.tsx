import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MODES } from '../data/mockData';
import { useShykey } from '../hooks/useShykey';
import type { ModeKey } from '../types';

const MODE_IMAGES = [
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85',
  'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=85',
];

const STORY_SLIDES = [
  {
    eyebrow: '01 / NOTICE THE MOMENT',
    title: 'Start with what feels real.',
    body: 'A new team, a message that stings, or someone you would like to know better. Pick the moment on your mind.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85',
    alt: 'Coworkers talking together around a table',
  },
  {
    eyebrow: '02 / MAKE IT SMALL',
    title: 'Choose one doable rep.',
    body: 'Shykey turns that moment into a practical next step. Make it smaller whenever you need to.',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85',
    alt: 'Friends sharing a relaxed conversation outdoors',
  },
  {
    eyebrow: '03 / TAKE IT WITH YOU',
    title: 'Reflect, then keep going.',
    body: 'Check in without judgment. Every attempt is useful practice, whether it went as planned or not.',
    image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=85',
    alt: 'A group of friends enjoying time together',
  },
];

export function MarketingPage() {
  const { services, selectMode, loadMission } = useShykey();
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(0);
  const [demoMode, setDemoMode] = useState(0);
  const [dialog, setDialog] = useState<'story' | 'mode' | null>(null);
  const [storySlide, setStorySlide] = useState(0);
  const [email, setEmail] = useState('');
  const [waitlistMessage, setWaitlistMessage] = useState('');
  const [waitlistError, setWaitlistError] = useState('');
  const [modeError, setModeError] = useState('');
  const [startingMode, setStartingMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  function changeMode(direction: number) {
    setActiveMode((current) => (current + direction + MODES.length) % MODES.length);
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
      setWaitlistMessage(
        'Thanks for trying the waitlist. This preview is in demo mode, so your email was not sent or saved.',
      );
    } catch (error) {
      setWaitlistError(error instanceof Error ? error.message : 'We could not submit your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="marketing-page">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="site-nav">
        <Link className="brand" to="/" aria-label="Shykey home">
          <span className="brand-mark" aria-hidden="true">s</span>
          <span>shykey</span>
        </Link>
        <nav className="site-nav-links" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#how-it-works">How it works</a>
          <a href="#paths">Practice paths</a>
        </nav>
        <div className="site-nav-actions">
          <Link className="nav-demo-link" to="/app">Test the demo</Link>
          <a className="nav-cta" href="#waitlist">Join the waitlist <span aria-hidden="true">↗</span></a>
        </div>
      </header>

      <main id="main-content">
        <section className="hero-section marketing-container">
          <div className="hero-copy">
            <p className="marketing-kicker"><span /> SOCIAL CONFIDENCE, PRACTICED</p>
            <h1>More you.<br />Less <span>overthinking.</span></h1>
            <p className="hero-description">
              A gentle practice space for showing up in real life. Start with one small, doable step.
            </p>
            <div className="hero-actions">
              <a className="marketing-button button-dark" href="#waitlist">Get early access <span aria-hidden="true">↗</span></a>
              <button className="text-button" type="button" onClick={() => { setStorySlide(0); setDialog('story'); }}>
                <span className="small-play" aria-hidden="true">▶</span> See how it works
              </button>
            </div>
            <div className="hero-note">
              <div className="avatar-stack" aria-hidden="true"><i>J</i><i>M</i><i>A</i></div>
              <p>Small reps. Real life. <b>Always at your pace.</b></p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-photo-wrap">
              <img
                className="hero-photo"
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=90"
                alt="Friends connecting and laughing together outdoors"
                fetchPriority="high"
              />
              <div className="photo-shade" />
              <span className="photo-label">REAL LIFE, ONE REP AT A TIME</span>
            </div>
            <div className="float-card mission-float">
              <span className="float-card-icon" aria-hidden="true">✦</span>
              <div><small>YOUR SMALL REP</small><b>Say hello and ask one real question.</b></div>
              <span className="float-check" aria-label="Ready">✓</span>
            </div>
            <div className="float-card pace-float">
              <span className="pace-sparkle" aria-hidden="true">✳</span>
              <div><b>At your pace</b><small>No streak pressure. Just practice.</small></div>
            </div>
            <span className="hero-scribble" aria-hidden="true">you've got this</span>
          </div>
        </section>

        <section className="trust-strip" aria-label="Shykey approach">
          <div><span>01</span> Built for everyday moments</div>
          <i aria-hidden="true" />
          <div><span>02</span> Small steps over perfect scripts</div>
          <i aria-hidden="true" />
          <div><span>03</span> Progress without pressure</div>
        </section>

        <section className="about-section marketing-container" id="about">
          <div className="about-photo-column">
            <div className="about-photo-frame">
              <img
                src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1000&q=85"
                alt="Friends gathered around a table, talking over a meal"
                loading="lazy"
              />
              <span className="photo-sticker">real connection<br />takes practice <b>♡</b></span>
            </div>
            <div className="about-caption"><span className="caption-line" /> A little more ease, in the moments that matter.</div>
          </div>
          <div className="about-copy">
            <p className="section-kicker">A DIFFERENT KIND OF SELF-HELP</p>
            <h2>Confidence isn’t<br />a personality type.</h2>
            <p>
              It grows through small experiences. Shykey helps you practice the conversations, boundaries,
              and everyday moments you want to feel more comfortable in.
            </p>
            <p>
              No pressure to become someone else. No score for being “good” at socializing. Just a little
              support to take the next step that feels right for you.
            </p>
            <a className="inline-link" href="#how-it-works">Get to know the approach <span aria-hidden="true">→</span></a>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="marketing-container">
            <div className="section-heading">
              <p className="section-kicker">A SMALLER WAY FORWARD</p>
              <h2>Three steps. <span>On your terms.</span></h2>
              <p>Think of it as a friendly nudge from intention to real life.</p>
            </div>
            <div className="steps-grid">
              <article className="step-card step-one">
                <div className="step-top"><span>01</span><span className="step-icon" aria-hidden="true">⌕</span></div>
                <h3>Choose your moment</h3>
                <p>Pick a practice path that fits what’s on your mind today.</p>
                <div className="step-visual step-visual-one"><span>Work</span><span>Feelings</span><span>Dating</span></div>
              </article>
              <article className="step-card step-two">
                <div className="step-top"><span>02</span><span className="step-icon" aria-hidden="true">↗</span></div>
                <h3>Try one small rep</h3>
                <p>Get a clear, real-world mission. Make it smaller if you need to.</p>
                <div className="step-visual step-visual-two"><span className="mini-task-check">✓</span><span>One doable next step</span></div>
              </article>
              <article className="step-card step-three">
                <div className="step-top"><span>03</span><span className="step-icon" aria-hidden="true">♡</span></div>
                <h3>Check in kindly</h3>
                <p>Reflect on how it went. Every attempt counts as information.</p>
                <div className="step-visual step-visual-three"><span>Done</span><span>Not yet</span><span>Something else</span></div>
              </article>
            </div>
          </div>
        </section>

        <section className="paths-section marketing-container" id="paths">
          <div className="paths-heading">
            <div>
              <p className="section-kicker">PRACTICE WHAT MATTERS TO YOU</p>
              <h2>Different moments.<br /><span>One kinder approach.</span></h2>
            </div>
            <div className="carousel-controls">
              <button className="carousel-arrow" type="button" onClick={() => changeMode(-1)} aria-label="Show previous practice path">←</button>
              <span aria-live="polite">{String(activeMode + 1).padStart(2, '0')} <i>/</i> {String(MODES.length).padStart(2, '0')}</span>
              <button className="carousel-arrow" type="button" onClick={() => changeMode(1)} aria-label="Show next practice path">→</button>
            </div>
          </div>
          <div className="path-carousel">
            <article className="path-card" style={{ '--path-color': mode.color } as CSSProperties}>
              <button className="path-image-button" type="button" onClick={() => setDialog('mode')} aria-label={`Learn about ${mode.name}`}>
                <img src={MODE_IMAGES[activeMode]} alt="" loading="lazy" />
                <span className="path-image-overlay" />
                <span className="path-label">PRACTICE PATH {String(activeMode + 1).padStart(2, '0')}</span>
                <span className="path-open" aria-hidden="true">↗</span>
              </button>
              <div className="path-card-copy">
                <div><p>{mode.name}</p><h3>{mode.title}</h3></div>
                <button className="path-detail-button" type="button" onClick={() => setDialog('mode')} aria-label={`More about ${mode.name}`}>↗</button>
              </div>
              <p className="path-description">{mode.description}</p>
            </article>
            <div className="path-aside">
              <span className="aside-sparkle" aria-hidden="true">✳</span>
              <p className="section-kicker">NO ONE-SIZE-FITS-ALL</p>
              <h3>Start where<br />you are.</h3>
              <p>Some days it’s a brave hello. Other days, it’s a pause before you reply. Your practice can change with you.</p>
              <button className="inline-link-button" type="button" onClick={() => setDialog('mode')}>
                Explore this path <span aria-hidden="true">→</span>
              </button>
              <div className="carousel-dots" role="group" aria-label="Choose a practice path">
                {MODES.map((item, index) => (
                  <button
                    key={item.key}
                    className={index === activeMode ? 'active' : ''}
                    type="button"
                    onClick={() => setActiveMode(index)}
                    aria-label={`Show ${item.name} path`}
                    aria-current={index === activeMode ? 'true' : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="story-section marketing-container">
          <div className="story-copy">
            <p className="section-kicker">A QUICK LOOK INSIDE</p>
            <h2>Make room for<br />the real <span>you.</span></h2>
            <p>Explore a short visual walkthrough of the Shykey practice loop—thoughtful prompts, tiny steps, and a check-in that meets you where you are.</p>
            <button className="marketing-button button-dark" type="button" onClick={() => { setStorySlide(0); setDialog('story'); }}>
              Play the walkthrough <span aria-hidden="true">↗</span>
            </button>
          </div>
          <button className="story-card" type="button" onClick={() => { setStorySlide(0); setDialog('story'); }} aria-label="Open the Shykey interactive walkthrough">
            <img src={STORY_SLIDES[0].image} alt="" loading="lazy" />
            <span className="story-card-shade" />
            <span className="story-play" aria-hidden="true">▶</span>
            <span className="story-card-label"><b>A SMALL REP, A REAL MOMENT</b><small>3 slides · Interactive walkthrough</small></span>
            <span className="story-card-corner" aria-hidden="true">SHYKEY / 01</span>
          </button>
        </section>

        <section className="demo-section" id="test-it">
          <div className="demo-inner marketing-container">
            <div className="demo-copy">
              <p className="section-kicker">DON’T JUST TAKE OUR WORD FOR IT</p>
              <h2>Give a tiny rep<br /><span>a try.</span></h2>
              <p>Get a feel for the kind of small, practical mission Shykey offers. No account needed in this prototype.</p>
              <Link className="marketing-button button-light" to="/app">Open the interactive demo <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="demo-card">
              <div className="demo-card-header"><span><i /> YOUR PRACTICE PREVIEW</span><small>NOT A SCRIPT</small></div>
              <p className="demo-path-label">{demo.name.toUpperCase()}</p>
              <h3>{demo.task}</h3>
              <p className="demo-why">{demo.why}</p>
              <div className="demo-card-footer">
                <button
                  type="button"
                  className="demo-next"
                  onClick={() => setDemoMode((current) => (current + 1) % MODES.length)}
                >Try another idea <span aria-hidden="true">↻</span></button>
                <span>{demoMode + 1} / {MODES.length}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="waitlist-section marketing-container" id="waitlist">
          <div className="waitlist-orbit orbit-one" aria-hidden="true" />
          <div className="waitlist-orbit orbit-two" aria-hidden="true" />
          <div className="waitlist-content">
            <p className="section-kicker">A LITTLE MORE EASE IS ON ITS WAY</p>
            <h2>Want to practice<br />with us?</h2>
            <p>Join the Shykey early-access waitlist and be among the first to try a kinder way to build confidence.</p>
            <form className="waitlist-form" onSubmit={(event) => void submitWaitlist(event)}>
              <label className="visually-hidden" htmlFor="waitlist-email">Email address</label>
              <input
                id="waitlist-email"
                type="email"
                autoComplete="email"
                placeholder="Your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button className="marketing-button button-dark" type="submit" disabled={submitting}>
                {submitting ? 'Joining…' : 'Join the waitlist'} <span aria-hidden="true">↗</span>
              </button>
            </form>
            {waitlistError && <p className="waitlist-feedback error" role="alert">{waitlistError}</p>}
            {waitlistMessage && <p className="waitlist-feedback" role="status">{waitlistMessage}</p>}
            <p className="privacy-note">Demo preview: emails are not sent or stored. No pressure, ever.</p>
          </div>
          <div className="waitlist-art" aria-hidden="true">
            <span className="art-circle art-circle-one" />
            <span className="art-circle art-circle-two" />
            <span className="art-smile">☺</span>
            <span className="art-sparkle">✳</span>
            <span className="art-note">one step<br />at a time</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <Link className="brand footer-brand" to="/"><span className="brand-mark" aria-hidden="true">s</span><span>shykey</span></Link>
        <p>Practice showing up as yourself.</p>
        <div><a href="#about">About</a><a href="#how-it-works">How it works</a><Link to="/app">Test the demo</Link></div>
        <small>© {new Date().getFullYear()} Shykey. A practice space, not a substitute for professional care.</small>
      </footer>

      {dialog && (
        <div className="marketing-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setDialog(null); }}>
          <section className="marketing-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <button className="dialog-close" type="button" onClick={() => setDialog(null)} aria-label="Close preview">×</button>
            {dialog === 'story' ? (
              <>
                <div className="dialog-story-image">
                  <img key={storySlide} src={STORY_SLIDES[storySlide].image} alt={STORY_SLIDES[storySlide].alt} />
                  <span className="dialog-story-mark">SHYKEY / A PRACTICE PREVIEW</span>
                  <div className="dialog-progress" aria-label={`Step ${storySlide + 1} of ${STORY_SLIDES.length}`}>
                    {STORY_SLIDES.map((slide, index) => <i key={slide.eyebrow} className={index <= storySlide ? 'complete' : ''} />)}
                  </div>
                </div>
                <div className="dialog-story-copy">
                  <p className="section-kicker">{STORY_SLIDES[storySlide].eyebrow}</p>
                  <h2 id="dialog-title">{STORY_SLIDES[storySlide].title}</h2>
                  <p>{STORY_SLIDES[storySlide].body}</p>
                  <div className="dialog-controls">
                    <button className="dialog-back" type="button" onClick={() => setStorySlide((current) => (current + STORY_SLIDES.length - 1) % STORY_SLIDES.length)}>← Back</button>
                    <span>{storySlide + 1} / {STORY_SLIDES.length}</span>
                    {storySlide < STORY_SLIDES.length - 1 ? (
                      <button className="marketing-button button-dark" type="button" onClick={() => setStorySlide((current) => current + 1)}>Next <span aria-hidden="true">→</span></button>
                    ) : (
                      <button className="marketing-button button-dark" type="button" onClick={() => { setDialog(null); document.getElementById('test-it')?.scrollIntoView({ behavior: 'smooth' }); }}>Try a mission <span aria-hidden="true">→</span></button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="dialog-mode-copy" style={{ '--path-color': mode.color } as CSSProperties}>
                <p className="section-kicker">PRACTICE PATH {String(activeMode + 1).padStart(2, '0')}</p>
                <h2 id="dialog-title">{mode.name}</h2>
                <p>{mode.description}</p>
                <div className="dialog-mission">
                  <span>ONE SMALL REP</span>
                  <b>{mode.task}</b>
                  <small>{mode.why}</small>
                </div>
                <button className="marketing-button button-dark" type="button" onClick={() => void startMode(mode.key)} disabled={startingMode}>
                  {startingMode ? 'Loading…' : 'Try this path'} <span aria-hidden="true">↗</span>
                </button>
                {modeError && <p className="waitlist-feedback error" role="alert">{modeError}</p>}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
