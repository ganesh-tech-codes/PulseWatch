import { useEffect, useState } from 'react';
import { DemoBanner } from './components/DemoBanner';
import { Header } from './components/Header';
import { IncidentHistory } from './components/IncidentHistory';
import { MonitorCard } from './components/MonitorCard';
import { MonitorTable } from './components/MonitorTable';
import { StatsGrid } from './components/StatsGrid';
import { UptimeChart } from './components/UptimeChart';
import { fetchDashboardData } from './lib/dashboardService';
import type { UptimeDashboardData } from './lib/dashboardService';

function App() {
  const [data, setData] = useState<UptimeDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData()
      .then(setData)
      .catch(() => setError('Failed to load dashboard data.'));
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      </div>
    );
  }

  const { monitors, incidents, stats } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <DemoBanner />
        <StatsGrid
          totalMonitors={stats.totalMonitors}
          upMonitors={stats.upMonitors}
          overallUptimePercent={stats.overallUptimePercent}
          avgResponseMs={stats.avgResponseMs}
          totalIncidents30d={stats.totalIncidents30d}
          openIncidents={stats.openIncidents}
        />
        <UptimeChart monitors={monitors} />
        <MonitorTable monitors={monitors} />

        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-900">
            Monitor Status
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {monitors.map((m) => (
              <MonitorCard key={m.id} monitor={m} />
            ))}
          </div>
        </section>

        <IncidentHistory incidents={incidents} />
      </main>
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        PulseWatch — demo dashboard. Real monitoring is not connected yet.
      </footer>
    </div>
  );
}

export default App;
