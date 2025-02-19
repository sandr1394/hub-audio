export interface InteractionsFilterParams {
  callId: string | null;
  segmentId: string | null;
  ani: string | null;
  dnis: string | null;
  dateFrom: string | null;
  dateTo: string | null;
}

export interface InteractionsElement {
  id: number;
  callId: string;
  callDuration: number;
  segmentId: string;
  ani: string;
  dateOfCall: string;
}
