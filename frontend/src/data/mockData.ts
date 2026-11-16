import type { Mode, ProfileStats, ReadingResult } from '../types';

export const MODES: Mode[] = [
  {
    key: 'professional',
    name: 'Professional',
    color: 'var(--pro)',
    title: 'Ask one real question',
    description: 'Build professional connections, one small hello at a time.',
    task: 'Ask a colleague one real question about their work',
    why: 'Small, low-stakes asks make bigger conversations feel normal.',
    smallTask: 'Say hi to someone and mention one thing about your day.',
  },
  {
    key: 'emotions',
    name: 'Emotions online',
    color: 'var(--emo)',
    title: 'Pause before replying',
    description: 'Stay steady when a message stings.',
    task: 'Wait ten minutes before replying to one tense message',
    why: 'The gap between feeling and replying is where calm lives.',
    smallTask: 'Take three slow breaths before you reply to anything today.',
  },
  {
    key: 'flirting',
    name: 'Flirting & dating',
    color: 'var(--flirt)',
    title: 'Compliment a Stranger',
    description: 'Build social confidence by giving genuine compliments.',
    task: 'Give a genuine compliment to a stranger',
    why: 'Warm, specific words get easy with repetition, and strangers almost always smile.',
    smallTask: 'Smile and say good morning to someone you pass.',
  },
];

export const INITIAL_STATS: ProfileStats = {
  streak: 3,
  reps: 12,
  best: 3,
  date: null,
};

export const COACH_OPENING = 'Before I write anything: what’s the situation?';

export const COACH_QUESTIONS = [
  'Who is this with, and how well do you know them?',
  'What would you like to happen afterwards?',
  'What’s the smallest real thing you could do today?',
];

export const SAMPLE_READING: ReadingResult = {
  readings: [
    { label: 'They’re busy', support: 'most_supported', explanation: 'Short replies often just mean bad timing.' },
    { label: 'Neutral, low energy', support: 'plausible', explanation: 'Some people text in a flat style with everyone.' },
    { label: 'A bit of distance', support: 'least_supported', explanation: 'Possible, but the least supported by one message.' },
  ],
  whatWouldSettleIt: 'Ask one light question, or wait for their next message.',
};

export const COACH_STARTERS = ['Texting someone new', 'Awkward at work', 'A tense message'];
