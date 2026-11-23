import { AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { formatDuration, formatRelativeTime } from '../lib/format';
import type { Incident } from '../lib/types';

function IncidentRow({ incident }: { incident: Incident }) {
  const open = incident.resolvedAt === null;
  return (
    <li className="flex gap-4 px-5 py-4 transition-colors hover:bg-gray-50">
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          open
            ? incident.severity === 'critical'
              ? 'bg-red-50 text-red-600'
              : 'bg-amber-50 text-amber-600'
            : 'bg-emerald-50 text-emerald-600'
        }`}
      >
        {open ? (
          <AlertTriangle className="h-5 w-5" />
        ) : (
          <CheckCircle2 className="h-5 w-5" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-gray-900">{incident.title}</p>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
              open
                ? 'bg-red-50 text-red-700 ring-red-600/20'
                : 'bg-gray-100 text-gray-600 ring-gray-500/20'
            }`}
          >
            {open ? 'Ongoing' : 'Resolved'}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
              incident.severity === 'critical'
                ? 'bg-red-50 text-red-700 ring-red-600/20'
                : 'bg-amber-50 text-amber-700 ring-amber-600/20'
            }`}
          >
            {incident.severity === 'critical' ? 'Critical' : 'Warning'}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">{incident.description}</p>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400">
          <span className="font-medium text-gray-500">{incident.monitorName}</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Started {formatRelativeTime(incident.startedAt)}
          </span>
          {incident.durationMinutes !== null && (
            <span>Lasted {formatDuration(incident.durationMinutes)}</span>
          )}
        </div>
      </div>
    </li>
  );
}

export function IncidentHistory({ incidents }: { incidents: Incident[] }) {
  const sorted = [...incidents].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 px-5 py-4">
        <h2 className="text-base font-semibold text-gray-900">Incident History</h2>
        <p className="mt-0.5 text-sm text-gray-500">
          Recent incidents across all monitored websites
        </p>
      </div>
      {sorted.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-gray-500">
          No incidents recorded. All systems operational.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {sorted.map((incident) => (
            <IncidentRow key={incident.id} incident={incident} />
          ))}
        </ul>
      )}
    </div>
  );
}
