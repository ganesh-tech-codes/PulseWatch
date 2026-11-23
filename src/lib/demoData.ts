import type { DashboardStats, Incident, Monitor, MonitorStatus } from './types';

const HOUR = 60 * 60 * 1000;

function buildHistory(
  uptimeProfile: 'healthy' | 'flaky' | 'troubled',
): Monitor['history'] {
  const now = Date.now();
  const points: Monitor['history'] = [];
  for (let i = 47; i >= 0; i--) {
    const timestamp = new Date(now - i * HOUR).toISOString();
    const r = Math.random();
    let uptimePercent: number;
    let avgResponseMs: number;

    if (uptimeProfile === 'healthy') {
      uptimePercent = r < 0.94 ? 100 : r < 0.98 ? 99.2 : 98.4;
      avgResponseMs = 140 + Math.round(r * 130);
    } else if (uptimeProfile === 'flaky') {
      uptimePercent = r < 0.78 ? 100 : r < 0.9 ? 97.5 : 91;
      avgResponseMs = 260 + Math.round(r * 420);
    } else {
      uptimePercent = r < 0.55 ? 99.1 : r < 0.8 ? 94 : 78;
      avgResponseMs = 700 + Math.round(r * 900);
    }
    points.push({ timestamp, uptimePercent, avgResponseMs });
  }
  return points;
}

function uptime24h(history: Monitor['history']): number {
  const last24 = history.slice(-24);
  return (
    Math.round(
      (last24.reduce((s, p) => s + p.uptimePercent, 0) / last24.length) * 100,
    ) / 100
  );
}

function uptime7d(history: Monitor['history']): number {
  const avg = history.reduce((s, p) => s + p.uptimePercent, 0) / history.length;
  return Math.round(avg * 100) / 100;
}

interface Seed {
  name: string;
  url: string;
  status: MonitorStatus;
  profile: 'healthy' | 'flaky' | 'troubled';
  forceResponseMs?: number | null;
}

const seeds: Seed[] = [
  { name: 'Marketing Site', url: 'https://acme.com', status: 'up', profile: 'healthy' },
  { name: 'App Dashboard', url: 'https://app.acme.com', status: 'up', profile: 'healthy' },
  { name: 'REST API (v2)', url: 'https://api.acme.com/v2', status: 'up', profile: 'healthy' },
  { name: 'Checkout Service', url: 'https://pay.acme.com', status: 'degraded', profile: 'flaky' },
  { name: 'Docs Portal', url: 'https://docs.acme.com', status: 'up', profile: 'healthy' },
  { name: 'Image CDN', url: 'https://cdn.acme.com', status: 'down', profile: 'troubled', forceResponseMs: null },
  { name: 'Webhook Gateway', url: 'https://hooks.acme.com', status: 'up', profile: 'flaky' },
  { name: 'Status Blog', url: 'https://status.acme.com', status: 'up', profile: 'healthy' },
];

export const demoMonitors: Monitor[] = seeds.map((seed, i) => {
  const history = buildHistory(seed.profile);
  const last = history[history.length - 1];
  return {
    id: `mon-${i + 1}`,
    name: seed.name,
    url: seed.url,
    status: seed.status,
    responseTimeMs:
      seed.forceResponseMs === null
        ? null
        : seed.forceResponseMs ?? last.avgResponseMs,
    lastCheckedAt: new Date(Date.now() - (i % 4) * 15 * 1000).toISOString(),
    uptime24h: uptime24h(history),
    uptime7d: uptime7d(history),
    history,
  };
});

const now = Date.now();

export const demoIncidents: Incident[] = [
  {
    id: 'inc-1',
    monitorId: 'mon-6',
    monitorName: 'Image CDN',
    title: 'CDN unreachable — connection timeouts',
    severity: 'critical',
    startedAt: new Date(now - 2 * HOUR).toISOString(),
    resolvedAt: null,
    durationMinutes: null,
    description:
      'Health checks from all regions are failing with connection timeouts. Providers incident is ongoing; failover to secondary edge is in progress.',
  },
  {
    id: 'inc-2',
    monitorId: 'mon-4',
    monitorName: 'Checkout Service',
    title: 'Elevated latency on payment intent creation',
    severity: 'warning',
    startedAt: new Date(now - 5 * HOUR).toISOString(),
    resolvedAt: null,
    durationMinutes: null,
    description:
      'p95 response time exceeded the 1,000 ms threshold. Requests still succeed; investigating a slow database query under heavy load.',
  },
  {
    id: 'inc-3',
    monitorId: 'mon-7',
    monitorName: 'Webhook Gateway',
    title: 'Intermittent 502 responses from upstream',
    severity: 'warning',
    startedAt: new Date(now - 26 * HOUR).toISOString(),
    resolvedAt: new Date(now - 23 * HOUR).toISOString(),
    durationMinutes: 180,
    description:
      'Upstream connection pool saturated, causing intermittent 502s for roughly 6% of deliveries. Pool size was increased and deliveries recovered.',
  },
  {
    id: 'inc-4',
    monitorId: 'mon-2',
    monitorName: 'App Dashboard',
    title: 'Brief outage after deploy',
    severity: 'critical',
    startedAt: new Date(now - 3 * 24 * HOUR).toISOString(),
    resolvedAt: new Date(now - 3 * 24 * HOUR - 0 + 14 * 60 * 1000).toISOString(),
    durationMinutes: 14,
    description:
      'A configuration rollback caused a short outage during a routine deploy. Traffic was rerouted and the deploy was re-run successfully.',
  },
  {
    id: 'inc-5',
    monitorId: 'mon-3',
    monitorName: 'REST API (v2)',
    title: 'Elevated error rate (5xx) on /users endpoint',
    severity: 'warning',
    startedAt: new Date(now - 6 * 24 * HOUR).toISOString(),
    resolvedAt: new Date(now - 6 * 24 * HOUR + 52 * 60 * 1000).toISOString(),
    durationMinutes: 52,
    description:
      'A malformed cache entry produced 500s for a subset of requests. The cache was purged and error rates returned to baseline.',
  },
];

export function computeStats(
  monitors: Monitor[],
  incidents: Incident[],
): DashboardStats {
  const up = monitors.filter((m) => m.status === 'up').length;
  const down = monitors.filter((m) => m.status === 'down').length;
  const degraded = monitors.filter((m) => m.status === 'degraded').length;
  const withTimes = monitors.filter((m) => m.responseTimeMs !== null);
  const avgResponseMs = withTimes.length
    ? Math.round(
        withTimes.reduce((s, m) => s + (m.responseTimeMs ?? 0), 0) /
          withTimes.length,
      )
    : 0;
  const overallUptimePercent = monitors.length
    ? Math.round(
        (monitors.reduce((s, m) => s + m.uptime24h, 0) / monitors.length) * 100,
      ) / 100
    : 100;

  return {
    totalMonitors: monitors.length,
    upMonitors: up,
    downMonitors: down,
    degradedMonitors: degraded,
    overallUptimePercent,
    avgResponseMs,
    openIncidents: incidents.filter((i) => i.resolvedAt === null).length,
    totalIncidents30d: incidents.length,
  };
}
