import { COACH_QUESTIONS, MODES, SAMPLE_READING } from '../data/mockData';
import type { AppServices, ChatReply, ModeKey, Mission } from '../types';

export const mockApi: AppServices = {
  async getMission(modeKey: ModeKey, variant: 'full' | 'small'): Promise<Mission> {
    const mode = MODES.find((item) => item.key === modeKey) ?? MODES[2];
    return {
      templateId: `${mode.key}-daily`,
      modeKey: mode.key,
      task: variant === 'small' ? mode.smallTask : mode.task,
      why: mode.why,
      variant,
    };
  },

  async commitMission(mission) {
    if (!mission) throw new Error('Choose a mission before committing it.');
    return `mock-assignment-${Date.now()}`;
  },

  async checkIn(_assignmentId, _outcome) {
    return Promise.resolve();
  },

  async sendCoachMessage(conversationId: string | null, _text: string, turn: number): Promise<ChatReply> {
    const reply = turn <= COACH_QUESTIONS.length
      ? COACH_QUESTIONS[turn - 1]
      : 'Got it. A small mission will help more than a script. Want one?';
    return { conversationId: conversationId ?? 'mock-conversation', text: reply };
  },

  async readMessage(_text: string) {
    return SAMPLE_READING;
  },

  async joinWaitlist(_email: string, _offerId?: string) {
    return Promise.resolve();
  },
};
