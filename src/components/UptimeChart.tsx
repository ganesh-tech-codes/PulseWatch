import { useMemo, useState } from 'react';
import type { Monitor } from '../lib/types';

const RANGES = [
  { key: '12h', label: '12h', points: 12 },
  { key: '24h', label: '24h', points: 24 },
  { key: '48h', label: '48h', points: 48 },
] as const;

type RangeKey = (typeof RANGES)[number]['key'];

const W = 800;
const H = 220;
const PAD = { top: 12, right: 12, bottom: 26, left: 42 };

export function UptimeChart({ monitors }: { monitors: Monitor[] }) {
  const [range, setRange] = useState<RangeKey>('24h');

  const series = useMemo(() => {
    const points = RANGES.find((r) => r.key === range)!.points;
    // Average across monitors so the chart shows fleet-wide uptime per hour
    const out: { timestamp: string; value: number }[] = [];
    const history = monitors[0]?.history ?? [];
    for (let i = history.length - points; i < history.length; i++) {
      if (i < 0) continue;
      let sum = 0;
      for (const m of monitors) sum += m.history[i]?.uptimePercent ?? 0;
      out.push({
        timestamp: history[i].timestamp,
        value: Math.round((sum / monitors.length) * 100) / 100,
      });
    }
    return out;
  }, [monitors, range]);

  const yMin = Math.max(0, Math.min(...series.map((p) => p.value), 100) - 3);
  const yMax = 100;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const toX = (i: number) =>
    PAD.left + (series.length <= 1 ? innerW / 2 : (i / (series.length - 1)) * innerW);
  const toY = (v: number) =>
    PAD.top + innerH - ((v - yMin) / (yMax - yMin || 1)) * innerH;

  const linePath = series
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(p.value).toFixed(1)}`)
    .join(' ');
  const areaPath =
    series.length > 1
      ? `${linePath} L ${toX(series.length - 1).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${toX(0).toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`
      : '';

  const yTicks = [yMin, yMin + (yMax - yMin) / 2, yMax];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Uptime History</h2>
          <p className="mt-0.5 text-sm text-gray-500">
            Average uptime across all monitors, per hour
          </p>
        </div>
        <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.key}
              onClick={() => setRange(r.key)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                range === r.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="mt-4 w-full"
        role="img"
        aria-label="Uptime history chart"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="uptimeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={toY(t)}
              y2={toY(t)}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <text
              x={PAD.left - 8}
              y={toY(t) + 4}
              textAnchor="end"
              className="fill-gray-400"
              fontSize="11"
            >
              {t.toFixed(0)}%
            </text>
          </g>
        ))}

        {areaPath && <path d={areaPath} fill="url(#uptimeFill)" />}
        <path d={linePath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />

        {series.map((p, i) => (
          <g key={i}>
            <circle
              cx={toX(i)}
              cy={toY(p.value)}
              r="3"
              fill="#fff"
              stroke="#10b981"
              strokeWidth="2"
            />
            <circle cx={toX(i)} cy={toY(p.value)} r="10" fill="transparent">
              <title>{`${new Date(p.timestamp).toLocaleString()} — ${p.value}%`}</title>
            </circle>
          </g>
        ))}

        {series.length > 1 && (
          <>
            <text
              x={toX(0)}
              y={H - 6}
              textAnchor="start"
              className="fill-gray-400"
              fontSize="11"
            >
              {new Date(series[0].timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </text>
            <text
              x={toX(series.length - 1)}
              y={H - 6}
              textAnchor="end"
              className="fill-gray-400"
              fontSize="11"
            >
              {new Date(series[series.length - 1].timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
