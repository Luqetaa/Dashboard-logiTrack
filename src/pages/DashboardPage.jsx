import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData"
import { MetricsCards } from "@/features/dashboard/components/MetricsCards"
import { RevenueChart } from "@/features/dashboard/components/RevenueChart"
import { OrderSourceChart } from "@/features/dashboard/components/OrderSourceChart"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"

/**
 * Dashboard page composing KPI cards, revenue chart, and status distribution.
 */
export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardData()

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Erro ao carregar dados do dashboard.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral das operações logísticas
        </p>
      </div>

      {/* KPI Cards */}
      {isLoading ? (
        <LoadingSkeleton variant="metrics" />
      ) : (
        <MetricsCards metrics={data.metrics} />
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <RevenueChart data={data.revenueChart} />
          )}
        </div>
        <div className="lg:col-span-2">
          {isLoading ? (
            <LoadingSkeleton variant="chart" />
          ) : (
            <OrderSourceChart data={data.statusDistribution} />
          )}
        </div>
      </div>
    </div>
  )
}
