import { memo, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Package, AlertTriangle, Users } from "lucide-react"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { cn, formatCurrency, formatPercentage } from "@/lib/utils"

const metricConfig = [
  {
    key: "totalRevenue",
    label: "Faturamento (30d)",
    icon: DollarSign,
    format: (v) => formatCurrency(v),
    color: "#2563eb",
    bgColor: "bg-blue-500/10 dark:bg-blue-500/20",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    key: "pendingOrders",
    label: "Pedidos Pendentes",
    icon: Package,
    format: (v) => v.toLocaleString("pt-BR"),
    color: "#f59e0b",
    bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    key: "delayRate",
    label: "Taxa de Atraso",
    icon: AlertTriangle,
    format: (v) => `${v.toFixed(1)}%`,
    color: "#ef4444",
    bgColor: "bg-red-500/10 dark:bg-red-500/20",
    iconColor: "text-red-600 dark:text-red-400",
    invertChange: true,
  },
  {
    key: "newCustomers",
    label: "Novos Clientes (30d)",
    icon: Users,
    format: (v) => v.toLocaleString("pt-BR"),
    color: "#16a34a",
    bgColor: "bg-green-500/10 dark:bg-green-500/20",
    iconColor: "text-green-600 dark:text-green-400",
  },
]

/**
 * Dashboard KPI metric cards with sparkline mini-charts.
 * @param {{ metrics: object }} props
 */
export const MetricsCards = memo(function MetricsCards({ metrics }) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {metricConfig.map((config) => {
        const data = metrics[config.key]
        if (!data) return null
        const isPositive = config.invertChange ? data.change <= 0 : data.change >= 0

        return (
          <MetricCard
            key={config.key}
            config={config}
            data={data}
            isPositive={isPositive}
          />
        )
      })}
    </div>
  )
})

const MetricCard = memo(function MetricCard({ config, data, isPositive }) {
  const sparklineData = useMemo(
    () => data.sparkline.map((value, i) => ({ value, index: i })),
    [data.sparkline]
  )

  return (
    <Card className="relative overflow-hidden py-0">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className={cn("flex items-center justify-center w-9 h-9 rounded-lg", config.bgColor)}>
              <config.icon className={cn("w-4.5 h-4.5", config.iconColor)} />
            </div>
            <p className="text-sm text-muted-foreground font-medium">{config.label}</p>
            <p className="text-2xl font-bold tracking-tight">{config.format(data.value)}</p>
          </div>

          {/* Mini sparkline */}
          <div className="w-20 h-10 mt-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={config.color}
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Change indicator */}
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded",
              isPositive
                ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30"
                : "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30"
            )}
          >
            {formatPercentage(data.change)}
          </span>
          <span className="text-xs text-muted-foreground">vs. período anterior</span>
        </div>
      </CardContent>
    </Card>
  )
})
