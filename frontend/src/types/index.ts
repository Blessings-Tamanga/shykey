export type ModeKey = 'professional' | 'emotions' | 'flirting';

export interface Mode {
  key: ModeKey;
  name: string;
  color: string;
  title: string;
  description: string;
  task: string;
  why: string;
  smallTask: string;
}

export interface Mission {
  templateId: string;
  modeKey: ModeKey;
  task: string;
  why: string;
  variant: 'full' | 'small';
}

export interface ProfileStats {
  streak: number;
  reps: number;
  best: number;
  date: string | null;
}

export type CheckinOutcome = 'done' | 'partial' | 'not_yet';

export interface ChatReply {
  conversationId: string;
  text: string;
}

export interface Reading {
  label: string;
  support: 'most_supported' | 'plausible' | 'least_supported';
  explanation: string;
}

export interface ReadingResult {
  readings: Reading[];
  whatWouldSettleIt: string;
}

export interface AppServices {
  getMission(mode: ModeKey, variant: 'full' | 'small'): Promise<Mission>;
  commitMission(mission: Mission | null, parentAssignmentId?: string | null): Promise<string>;
  checkIn(assignmentId: string | null, outcome: CheckinOutcome): Promise<void>;
  sendCoachMessage(conversationId: string | null, text: string, turn: number): Promise<ChatReply>;
  readMessage(text: string): Promise<ReadingResult>;
  joinWaitlist(email: string, offerId?: string): Promise<void>;
}
