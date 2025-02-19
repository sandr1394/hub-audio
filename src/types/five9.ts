export interface Five9FilterParams {
  callId: string | null;
  sessionId: string | null;
  ani: string | null;
  dnis: string | null;
  agentId: string | null;
  campaignId: string | null;
  dateFrom: string | null;
  dateTo: string | null;
}

export interface Five9Element {
  id: number;
  sessionId: string | null;
  callDuration: number;
  callId: string;
  agentFirstName: string;
  agentLastName: string;
  agentEmail: string;
  campaign: string;
  ani: string | null;
  dateOfCall: string;
}

export interface Agent {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Campaign {
  id: number;
  campaignName: string;
}
