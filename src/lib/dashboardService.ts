import type { DashboardStats, Incident, Monitor } from './types';
import { computeStats, demoIncidents, demoMonitors } from './demoData';

export interface UptimeDashboardData {
  monitors: Monitor[];
  incidents: Incident[];
  stats: DashboardStats;
}

/**
 * Frontend-only demo data source. Swap this implementation for a real
 * HTTP/WebSocket client when the Node.js monitoring backend is ready —
 * the rest of the app only depends on this interface.
 */
export async function fetchDashboardData(): Promise<UptimeDashboardData> {
  const monitors = demoMonitors;
  const incidents = demoIncidents;
  return { monitors, incidents, stats: computeStats(monitors, incidents) };
}
