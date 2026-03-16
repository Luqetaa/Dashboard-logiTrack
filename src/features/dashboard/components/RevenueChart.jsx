import { memo, useMemo, useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

const periods = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "12m", days: 365 },
]

/**
 * Custom tooltip for the revenue chart.
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-sm text-primary font-semibold">{formatCurrency(payload[0].value)}</p>
      {payload[1] && (
        <p className="text-sm text-muted-foreground">
          {payload[1].value} pedidos
        </p>
      )}
    </div>
  )
}

/**
 * Revenue area chart with period filter tabs.
 * @param {{ data: Array<{ month: string, revenue: number, orders: number }> }} props
 */
export const RevenueChart = memo(function RevenueChart({ data }) {
  const [period, setPeriod] = useState("12m")

  const filteredData = useMemo(() => {
    if (!data) return []
    const p = periods.find((p) => p.label === period)
    if (period === "12m") return data
    const sliceCount = Math.min(Math.ceil(p.days / 30), data.length)
    return data.slice(-sliceCount)
  }, [data, period])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Receita Mensal</CardTitle>
        <div className="flex gap-1">
          {periods.map((p) => (
            <Button
              key={p.label}
              variant={period === p.label ? "default" : "ghost"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setPeriod(p.label)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                className="fill-muted-foreground"
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
})
