import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchOrders, fetchDashboardStats, REGION_OPTIONS, STATUS_OPTIONS } from "@/services/apiMock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { formatCurrency } from "@/lib/utils"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TrendingUp, TrendingDown, MapPin, BarChart3 } from "lucide-react"

const REGION_COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"]

/**
 * Reports page with regional analysis, top customers, and statistical cards.
 */
export default function ReportsPage() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
    staleTime: 5 * 60 * 1000,
  })

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["allOrders"],
    queryFn: () => fetchOrders({ page: 1, limit: 500 }),
    staleTime: 5 * 60 * 1000,
  })

  const isLoading = statsLoading || ordersLoading

  const regionData = useMemo(() => {
    if (!ordersData?.orders) return []
    return REGION_OPTIONS.map((region) => {
      const regionOrders = ordersData.orders.filter((o) => o.region === region)
      return {
        region,
        orders: regionOrders.length,
        revenue: regionOrders.reduce((sum, o) => sum + o.value, 0),
        avgTicket: regionOrders.length > 0
          ? regionOrders.reduce((sum, o) => sum + o.value, 0) / regionOrders.length
          : 0,
      }
    }).sort((a, b) => b.revenue - a.revenue)
  }, [ordersData])

  const topCustomers = useMemo(() => {
    if (!ordersData?.orders) return []
    const customerMap = new Map()
    ordersData.orders.forEach((o) => {
      const existing = customerMap.get(o.email) || { name: o.customer, email: o.email, orders: 0, total: 0 }
      existing.orders++
      existing.total += o.value
      customerMap.set(o.email, existing)
    })
    return Array.from(customerMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)
  }, [ordersData])

  const summaryStats = useMemo(() => {
    if (!ordersData?.orders) return null
    const orders = ordersData.orders
    const total = orders.length
    const totalRevenue = orders.reduce((sum, o) => sum + o.value, 0)
    const avgTicket = total > 0 ? totalRevenue / total : 0
    const deliveredRate = total > 0 ? (orders.filter((o) => o.status === "Entregue").length / total) * 100 : 0

    return { total, totalRevenue, avgTicket, deliveredRate }
  }, [ordersData])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        <p className="text-muted-foreground">Análises e métricas detalhadas</p>
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="metrics" />
      ) : (
        <>
          {/* Summary stats */}
          {summaryStats && (
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total de Pedidos" value={summaryStats.total.toLocaleString("pt-BR")} />
              <StatCard label="Receita Total" value={formatCurrency(summaryStats.totalRevenue)} />
              <StatCard label="Ticket Médio" value={formatCurrency(summaryStats.avgTicket)} />
              <StatCard label="Taxa de Entrega" value={`${summaryStats.deliveredRate.toFixed(1)}%`} />
            </div>
          )}

          {/* Charts row */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue by region bar chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Receita por Região
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={regionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                      <XAxis dataKey="region" tick={{ fontSize: 12 }} className="fill-muted-foreground" axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12 }} className="fill-muted-foreground" axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} width={45} />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null
                          return (
                            <div className="rounded-lg border bg-card p-3 shadow-lg">
                              <p className="font-medium text-sm">{label}</p>
                              <p className="text-sm text-primary">{formatCurrency(payload[0].value)}</p>
                            </div>
                          )
                        }}
                      />
                      <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                        {regionData.map((_, idx) => (
                          <Cell key={idx} fill={REGION_COLORS[idx % REGION_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Region stats table */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Detalhamento por Região
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Região</TableHead>
                      <TableHead className="text-right">Pedidos</TableHead>
                      <TableHead className="text-right">Receita</TableHead>
                      <TableHead className="text-right">Ticket Médio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regionData.map((row) => (
                      <TableRow key={row.region}>
                        <TableCell className="font-medium">{row.region}</TableCell>
                        <TableCell className="text-right">{row.orders}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.revenue)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(row.avgTicket)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Top Customers */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Top 10 Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Pedidos</TableHead>
                    <TableHead className="text-right">Total Gasto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCustomers.map((customer, idx) => (
                    <TableRow key={customer.email}>
                      <TableCell className="font-medium text-muted-foreground">{idx + 1}</TableCell>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{customer.email}</TableCell>
                      <TableCell className="text-right">{customer.orders}</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(customer.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-xl font-bold mt-1">{value}</p>
      </CardContent>
    </Card>
  )
}
