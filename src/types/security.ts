
// Local type definitions for security features
export interface SecurityEvent {
  id: string;
  event_type: string;
  user_id?: string;
  details: any;
  created_at: string;
}

export interface SecurityStats {
  totalEvents: number;
  failedLogins: number;
  successfulLogins: number;
  blockedAccounts: number;
  adminLogins: number;
}

export interface SecurityMetrics {
  failedAttempts: number;
  isBlocked: boolean;
  lastAttempt: Date | null;
  blockExpiresAt: Date | null;
}
