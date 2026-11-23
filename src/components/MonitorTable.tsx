import { ExternalLink } from 'lucide-react';
import { statusMeta, formatRelativeTime } from '../lib/format';
import type { Monitor } from '../lib/types';

export function MonitorTable({ monitors }: { monitors: Monitor[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">Monitors</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          All monitored websites and their current health
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-5 py-3">Website</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Response Time</th>
              <th className="hidden px-5 py-3 md:table-cell">Uptime (24h)</th>
              <th className="hidden px-5 py-3 lg:table-cell">Last Checked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {monitors.map((m) => {
              const meta = statusMeta[m.status];
              return (
                <tr key={m.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${meta.dot}`} />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">{m.name}</p>
                        <a
                          href={m.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600"
                        >
                          <span className="truncate max-w-[220px]">{m.url}</span>
                          <ExternalLink className="h-3 w-3 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${meta.badge}`}
                    >
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {m.responseTimeMs === null ? (
                      <span className="text-gray-400">No response</span>
                    ) : (
                      <span className="font-medium text-gray-900 tabular-nums">
                        {m.responseTimeMs} ms
                      </span>
                    )}
                  </td>
                  <td className="hidden px-5 py-4 md:table-cell">
                    <span
                      className={`font-medium tabular-nums ${
                        m.uptime24h >= 99
                          ? 'text-emerald-600'
                          : m.uptime24h >= 95
                            ? 'text-amber-600'
                            : 'text-red-600'
                      }`}
                    >
                      {m.uptime24h}%
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 text-gray-500 lg:table-cell">
                    {formatRelativeTime(m.lastCheckedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
