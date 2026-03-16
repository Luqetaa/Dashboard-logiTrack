import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchOrders } from "@/services/apiMock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { formatDate, cn } from "@/lib/utils"
import { Search, MapPin, Truck, CheckCircle2, Clock, XCircle, AlertTriangle, Package } from "lucide-react"

const statusConfig = {
  Entregue: { icon: CheckCircle2, color: "text-green-500", bgColor: "bg-green-500" },
  "Em Trânsito": { icon: Truck, color: "text-blue-500", bgColor: "bg-blue-500" },
  Processando: { icon: Clock, color: "text-amber-500", bgColor: "bg-amber-500" },
  Atrasado: { icon: AlertTriangle, color: "text-red-500", bgColor: "bg-red-500" },
  Cancelado: { icon: XCircle, color: "text-gray-500", bgColor: "bg-gray-500" },
}

const trackingSteps = {
  Processando: 1,
  "Em Trânsito": 2,
  Entregue: 3,
  Atrasado: 2,
  Cancelado: 0,
}

/**
 * Tracking page with visual pipeline for order status.
 */
export default function TrackingPage() {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  function handleSearch(value) {
    setSearch(value)
    clearTimeout(window._trackingSearchTimeout)
    window._trackingSearchTimeout = setTimeout(() => setDebouncedSearch(value), 300)
  }

  const { data, isLoading } = useQuery({
    queryKey: ["tracking", debouncedSearch],
    queryFn: () =>
      fetchOrders({
        page: 1,
        limit: 20,
        search: debouncedSearch,
        status: "all",
        sortBy: "date",
        sortOrder: "desc",
      }),
    staleTime: 2 * 60 * 1000,
  })

  const activeOrders = useMemo(() => {
    if (!data?.orders) return []
    return data.orders.filter((o) => o.status !== "Entregue" && o.status !== "Cancelado")
  }, [data])

  const completedOrders = useMemo(() => {
    if (!data?.orders) return []
    return data.orders.filter((o) => o.status === "Entregue" || o.status === "Cancelado")
  }, [data])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Rastreamento</h1>
        <p className="text-muted-foreground">
          Acompanhe o status dos envios em tempo real
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por código de rastreio ou pedido..."
          className="pl-9"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton variant="table" />
      ) : (
        <>
          {/* Active shipments */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              Em Andamento ({activeOrders.length})
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {activeOrders.map((order) => (
                <TrackingCard key={order.id} order={order} />
              ))}
              {activeOrders.length === 0 && (
                <p className="text-muted-foreground col-span-2 text-center py-8">
                  Nenhum envio em andamento encontrado.
                </p>
              )}
            </div>
          </div>

          {/* Completed */}
          {completedOrders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Finalizados ({completedOrders.length})
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {completedOrders.map((order) => (
                  <TrackingCard key={order.id} order={order} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function TrackingCard({ order }) {
  const config = statusConfig[order.status] || statusConfig.Processando
  const StatusIcon = config.icon
  const currentStep = trackingSteps[order.status] ?? 0
  const steps = ["Processando", "Em Trânsito", "Entregue"]

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-sm font-semibold">{order.id}</span>
              <Badge variant="outline" className="text-xs">
                <StatusIcon className={cn("w-3 h-3 mr-1", config.color)} />
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{order.customer}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">{formatDate(order.date)}</p>
            <p className="text-xs font-mono text-muted-foreground mt-0.5">{order.trackingCode}</p>
          </div>
        </div>

        {/* Progress steps */}
        {order.status !== "Cancelado" && (
          <div className="flex items-center gap-1 mt-3">
            {steps.map((step, idx) => {
              const isActive = idx < currentStep
              const isCurrent = idx === currentStep - 1
              return (
                <div key={step} className="flex-1 flex items-center gap-1">
                  <div
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors",
                      isActive ? config.bgColor : "bg-muted"
                    )}
                  />
                  {idx < steps.length - 1 && <div className="w-1" />}
                </div>
              )
            })}
          </div>
        )}

        <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
          <MapPin className="w-3 h-3" />
          {order.address.city} - {order.address.state}
        </div>
      </CardContent>
    </Card>
  )
}
