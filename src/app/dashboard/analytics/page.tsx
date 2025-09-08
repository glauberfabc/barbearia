import { AnalyticsDashboard } from '@/components/analytics-dashboard';

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Análise Preditiva & Estatísticas</h1>
      </div>
      <AnalyticsDashboard />
    </div>
  );
}
