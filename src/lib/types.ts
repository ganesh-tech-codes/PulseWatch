export type MonitorStatus = 'up' | 'down' | 'degraded';

export interface Monitor {
  id: string;
  name: string;
  url: string;
  status: MonitorStatus;
  responseTimeMs: number | null;
  lastCheckedAt: string;
  uptime24h: number;
  uptime7d: number;
  // Uptime per hour for the last 24 hours (index 0 = 24h ago, last = now)
  history: { timestamp: string; uptimePercent: number; avgResponseMs: number }[];
}

export interface Incident {
  id: string;
  monitorId: string;
  monitorName: string;
  title: string;
  severity: 'critical' | 'warning';
  startedAt: string;
  resolvedAt: string | null;
  durationMinutes: number | null;
  description: string;
}

export interface DashboardStats {
  totalMonitors: number;
  upMonitors: number;
  downMonitors: number;
  degradedMonitors: number;
  overallUptimePercent: number;
  avgResponseMs: number;
  openIncidents: number;
  totalIncidents30d: number;
}
