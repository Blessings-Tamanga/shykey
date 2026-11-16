import type { AppServices, ChatReply, ModeKey, Mission, ReadingResult } from '../types';

interface ApiError {
  error?: {
    message?: string;
  };
}

interface MissionResponse {
  template_id: string;
  mode_key: ModeKey;
  variant: 'full' | 'small';
  task: string;
  why: string;
}

interface AssignmentResponse {
  id: string;
}

interface CoachResponse {
  reply: { text: string };
}

interface ReadResponse {
  readings: ReadingResult['readings'];
  what_would_settle_it: string;
}

export type AccessTokenProvider = () => string | null | Promise<string | null>;

async function request<T>(
  baseUrl: string,
  path: string,
  init?: RequestInit,
  getAccessToken?: AccessTokenProvider,
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  const token = await getAccessToken?.();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${baseUrl.replace(/\/$/, '')}${path}`, {
    ...init,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch((): ApiError => ({})) as ApiError;
    throw new Error(error.error?.message ?? `Request failed (${response.status})`);
  }

  return response.status === 204 ? undefined as T : response.json() as Promise<T>;
}

export function createApiService(baseUrl: string, getAccessToken?: AccessTokenProvider): AppServices {
  return {
    async getMission(mode: ModeKey, variant: 'full' | 'small'): Promise<Mission> {
      const query = new URLSearchParams({ mode, variant });
      const result = await request<MissionResponse>(baseUrl, `/v1/missions/next?${query}`, undefined, getAccessToken);
      return {
        templateId: result.template_id,
        modeKey: result.mode_key,
        task: result.task,
        why: result.why,
        variant: result.variant,
      };
    },

    async commitMission(mission: Mission | null, parentAssignmentId?: string | null): Promise<string> {
      if (!mission) throw new Error('Choose a mission before committing it.');
      const result = await request<AssignmentResponse>(baseUrl, '/v1/assignments', {
        method: 'POST',
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify({
          template_id: mission.templateId,
          variant: mission.variant,
          source: 'mission',
          conversation_id: null,
          read_id: null,
          parent_assignment_id: parentAssignmentId ?? null,
          replace_open: false,
        }),
      }, getAccessToken);
      return result.id;
    },

    async checkIn(assignmentId, outcome): Promise<void> {
      if (!assignmentId) throw new Error('There is no committed mission to check in.');
      await request(baseUrl, `/v1/assignments/${assignmentId}/checkin`, {
        method: 'POST',
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify({ outcome }),
      }, getAccessToken);
    },

    async sendCoachMessage(conversationId: string | null, text: string): Promise<ChatReply> {
      let activeConversationId = conversationId;
      if (!activeConversationId) {
        const created = await request<{ conversation_id: string; opening: { text: string } }>(
          baseUrl,
          '/v1/conversations',
          { method: 'POST', body: JSON.stringify({ mode_key: 'flirting' }) },
          getAccessToken,
        );
        activeConversationId = created.conversation_id;
      }

      const result = await request<CoachResponse>(
        baseUrl,
        `/v1/conversations/${activeConversationId}/messages`,
        {
          method: 'POST',
          headers: { 'Idempotency-Key': crypto.randomUUID() },
          body: JSON.stringify({ text, action: null, user_draft: null }),
        },
        getAccessToken,
      );
      return { conversationId: activeConversationId, text: result.reply.text };
    },

    async readMessage(text: string): Promise<ReadingResult> {
      const result = await request<ReadResponse>(baseUrl, '/v1/reads', {
        method: 'POST',
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify({ text }),
      }, getAccessToken);
      return { readings: result.readings, whatWouldSettleIt: result.what_would_settle_it };
    },

    async joinWaitlist(email: string, offerId?: string): Promise<void> {
      if (!offerId) throw new Error('An offer ID is required to join the waitlist.');
      await request(baseUrl, '/v1/waitlist', {
        method: 'POST',
        headers: { 'Idempotency-Key': crypto.randomUUID() },
        body: JSON.stringify({ email, consent: true, offer_id: offerId }),
      }, getAccessToken);
    },
  };
}
