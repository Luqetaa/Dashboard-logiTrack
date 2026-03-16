import { memo, useMemo } from "react"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const STATUS_COLORS = {
  Entregue: "#16a34a",
  "Em Trânsito": "#3b82f6",
  Processando: "#f59e0b",
  Atrasado: "#ef4444",
  Cancelado: "#6b7280",
}

/**
 * Custom tooltip for the donut chart.
 */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value } = payload[0]
  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg">
      <p className="text-sm font-medium">{name}</p>
      <p className="text-sm font-semibold">{value} pedidos</p>
    </div>
  )
}

/**
 * Custom center label showing total orders.
 */
function CenterLabel({ viewBox, total }) {
  const { cx, cy } = viewBox
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} y={cy - 8} className="fill-foreground text-2xl font-bold">
        {total}
      </tspan>
      <tspan x={cx} y={cy + 14} className="fill-muted-foreground text-xs">
        total
      </tspan>
    </text>
  )
}

/**
 * Donut chart showing order distribution by status.
 * @param {{ data: Array<{ name: string, value: number }> }} props
 */
export const OrderSourceChart = memo(function OrderSourceChart({ data }) {
  const total = useMemo(() => data?.reduce((sum, d) => sum + d.value, 0) || 0, [data])

  if (!data) return null

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Pedidos por Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
                label={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 justify-center">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: STATUS_COLORS[entry.name] || "#94a3b8" }}
              />
              <span className="text-muted-foreground">{entry.name}</span>
              <span className="font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
