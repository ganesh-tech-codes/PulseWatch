import { FlaskConical } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        <span className="font-semibold">Demo data.</span> All monitors, uptime
        numbers and incidents shown here are sample data for preview purposes.
        No real websites are being monitored yet.
      </p>
    </div>
  );
}
