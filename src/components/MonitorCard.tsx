import { statusMeta, formatRelativeTime } from '../lib/format';
import type { Monitor } from '../lib/types';

function UptimeBar({ monitor }: { monitor: Monitor }) {
  const segments = monitor.history;
  return (
    <div className="flex h-8 items-stretch gap-[2px]" title="Last 48 hours">
      {segments.map((p, i) => {
        const color =
          p.uptimePercent >= 99
            ? 'bg-emerald-400 hover:bg-emerald-500'
            : p.uptimePercent >= 95
              ? 'bg-amber-400 hover:bg-amber-500'
              : 'bg-red-400 hover:bg-red-500';
        return (
          <div
            key={i}
            className={`flex-1 rounded-[2px] transition-colors ${color}`}
            title={`${new Date(p.timestamp).toLocaleString()} — ${p.uptimePercent}% uptime`}
          />
        );
      })}
    </div>
  );
}

export function MonitorCard({ monitor }: { monitor: Monitor }) {
  const meta = statusMeta[monitor.status];
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} />
            <h3 className="truncate font-semibold text-gray-900">{monitor.name}</h3>
          </div>
          <p className="mt-1 truncate text-sm text-gray-500">{monitor.url}</p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${meta.badge}`}
        >
          {meta.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-gray-50 px-2 py-2">
          <p className="text-lg font-semibold tabular-nums text-gray-900">
            {monitor.uptime24h}%
          </p>
          <p className="text-xs text-gray-500">Uptime 24h</p>
        </div>
        <div className="rounded-lg bg-gray-50 px-2 py-2">
          <p className="text-lg font-semibold tabular-nums text-gray-900">
            {monitor.uptime7d}%
          </p>
          <p className="text-xs text-gray-500">Uptime 7d</p>
        </div>
        <div className="rounded-lg bg-gray-50 px-2 py-2">
          <p className="text-lg font-semibold tabular-nums text-gray-900">
            {monitor.responseTimeMs === null ? '—' : `${monitor.responseTimeMs}`}
          </p>
          <p className="text-xs text-gray-500">ms response</p>
        </div>
      </div>

      <div className="mt-4">
        <UptimeBar monitor={monitor} />
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>48h ago</span>
          <span>Checked {formatRelativeTime(monitor.lastCheckedAt)}</span>
        </div>
      </div>
    </div>
  );
}
