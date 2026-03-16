import { useState, useMemo, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table"
import { fetchOrders, STATUS_OPTIONS, REGION_OPTIONS } from "@/services/apiMock"
import { formatCurrency, formatDate, cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package,
  Eye,
} from "lucide-react"

const statusColors = {
  Entregue: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
  "Em Trânsito": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  Processando: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  Atrasado: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  Cancelado: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
}

/**
 * Status badge component.
 * @param {{ status: string }} props
 */
function StatusBadge({ status }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium py-0.5 px-2",
        statusColors[status] || "bg-secondary text-secondary-foreground"
      )}
    >
      {status}
    </Badge>
  )
}

/**
 * Full-featured orders page with server-side-like pagination,
 * search, filter, sort, and detail dialog.
 */
export default function OrdersPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Debounce search
  const handleSearch = useCallback((value) => {
    setSearchQuery(value)
    clearTimeout(window._searchTimeout)
    window._searchTimeout = setTimeout(() => {
      setDebouncedSearch(value)
      setPage(1)
    }, 300)
  }, [])

  const { data, isLoading, isError } = useQuery({
    queryKey: ["orders", page, limit, statusFilter, regionFilter, debouncedSearch, sortBy, sortOrder],
    queryFn: () =>
      fetchOrders({
        page,
        limit,
        status: statusFilter,
        region: regionFilter,
        search: debouncedSearch,
        sortBy,
        sortOrder,
      }),
    keepPreviousData: true,
    staleTime: 2 * 60 * 1000,
  })

  function handleSort(column) {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
    setPage(1)
  }

  function SortIcon({ column }) {
    if (sortBy !== column) return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/50" />
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-primary" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-primary" />
    )
  }

  const columns = useMemo(
    () => [
      {
        id: "id",
        header: "Pedido",
        accessorKey: "id",
        cell: ({ row }) => <span className="font-mono text-xs font-medium">{row.original.id}</span>,
      },
      {
        id: "customer",
        header: "Cliente",
        accessorKey: "customer",
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-sm">{row.original.customer}</p>
            <p className="text-xs text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      },
      {
        id: "date",
        header: "Data",
        accessorKey: "date",
        cell: ({ row }) => (
          <span className="text-sm">{formatDate(row.original.date)}</span>
        ),
      },
      {
        id: "value",
        header: "Valor",
        accessorKey: "value",
        cell: ({ row }) => (
          <span className="font-medium text-sm">{formatCurrency(row.original.value)}</span>
        ),
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "region",
        header: "Região",
        accessorKey: "region",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-sm">{row.original.region}</span>
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSelectedOrder(row.original)}
          >
            <Eye className="w-4 h-4" />
            <span className="sr-only">Ver detalhes</span>
          </Button>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: data?.orders ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: data?.totalPages ?? 0,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-muted-foreground">
          Gerencie e acompanhe todos os pedidos
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, cliente ou código..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filters */}
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={(v) => { setRegionFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Região" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as regiões</SelectItem>
                {REGION_OPTIONS.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="px-0 pt-0">
          {isLoading ? (
            <div className="px-6">
              <LoadingSkeleton variant="table" />
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-destructive">Erro ao carregar pedidos.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      {table.getHeaderGroups().map((headerGroup) =>
                        headerGroup.headers.map((header) => {
                          const canSort = ["id", "customer", "date", "value", "status", "region"].includes(header.id)
                          return (
                            <TableHead
                              key={header.id}
                              className={cn(canSort && "cursor-pointer select-none hover:text-foreground")}
                              onClick={() => canSort && handleSort(header.id)}
                            >
                              <div className="flex items-center gap-1.5">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {canSort && <SortIcon column={header.id} />}
                              </div>
                            </TableHead>
                          )
                        })
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="h-40 text-center text-muted-foreground">
                          Nenhum pedido encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} className="group">
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  {data.totalItems} pedido{data.totalItems !== 1 ? "s" : ""} encontrado{data.totalItems !== 1 ? "s" : ""}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Anterior
                  </Button>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">Página</span>
                    <span className="font-medium">{page}</span>
                    <span className="text-muted-foreground">de</span>
                    <span className="font-medium">{data.totalPages}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                    disabled={page >= data.totalPages}
                  >
                    Próxima
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Order detail dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {selectedOrder?.id}
            </DialogTitle>
            <DialogDescription>Detalhes do pedido</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Data</p>
                  <p className="font-medium">{formatDate(selectedOrder.date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div>
                  <p className="text-muted-foreground">Valor Total</p>
                  <p className="font-semibold text-primary">{formatCurrency(selectedOrder.value)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Rastreio</p>
                  <p className="font-mono text-xs">{selectedOrder.trackingCode}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Endereço de Entrega</p>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.address.street}
                  <br />
                  {selectedOrder.address.city} - {selectedOrder.address.state}
                  <br />
                  CEP: {selectedOrder.address.zip}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Itens ({selectedOrder.items.length})</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
