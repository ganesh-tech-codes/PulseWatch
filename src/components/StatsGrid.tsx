import { AlertTriangle, Globe, ShieldCheck, Timer } from 'lucide-react';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: ReactNode;
  tone: 'emerald' | 'blue' | 'amber' | 'red';
}

const toneStyles: Record<StatCardProps['tone'], { iconBg: string; iconColor: string }> = {
  emerald: { iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  blue: { iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  amber: { iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
  red: { iconBg: 'bg-red-50', iconColor: 'text-red-600' },
};

export function StatCard({ label, value, sub, icon, tone }: StatCardProps) {
  const t = toneStyles[tone];
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${t.iconBg} ${t.iconColor}`}>
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
    </div>
  );
}

interface StatsGridProps {
  totalMonitors: number;
  upMonitors: number;
  overallUptimePercent: number;
  avgResponseMs: number;
  totalIncidents30d: number;
  openIncidents: number;
}

export function StatsGrid({
  totalMonitors,
  upMonitors,
  overallUptimePercent,
  avgResponseMs,
  totalIncidents30d,
  openIncidents,
}: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Websites Monitored"
        value={String(totalMonitors)}
        sub={`${upMonitors} currently operational`}
        icon={<Globe className="h-5 w-5" />}
        tone="blue"
      />
      <StatCard
        label="Overall Uptime (24h)"
        value={`${overallUptimePercent}%`}
        sub="Across all monitors"
        icon={<ShieldCheck className="h-5 w-5" />}
        tone="emerald"
      />
      <StatCard
        label="Avg Response Time"
        value={`${avgResponseMs} ms`}
        sub="Average of all monitors"
        icon={<Timer className="h-5 w-5" />}
        tone="amber"
      />
      <StatCard
        label="Incidents (30 days)"
        value={String(totalIncidents30d)}
        sub={`${openIncidents} currently open`}
        icon={<AlertTriangle className="h-5 w-5" />}
        tone={openIncidents > 0 ? 'red' : 'emerald'}
      />
    </div>
  );
}
