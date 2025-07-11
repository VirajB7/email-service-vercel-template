export interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  idempotencyKey: string;
}

export interface EmailStatus {
  status: 'success' | 'failed' | 'retrying' | 'fallback';
  provider: string;
  attempts: number;
}