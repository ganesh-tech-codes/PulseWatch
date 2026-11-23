import { Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Activity className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight text-gray-900">
              PulseWatch
            </p>
            <p className="text-xs leading-tight text-gray-500">
              Uptime Monitoring
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
            Demo mode
          </span>
        </div>
      </div>
    </header>
  );
}
