import { faker } from "@faker-js/faker/locale/pt_BR"

faker.seed(42)

const STATUS_OPTIONS = ["Entregue", "Em Trânsito", "Cancelado", "Atrasado", "Processando"]
const REGION_OPTIONS = ["SP", "RJ", "MG", "PR", "BA"]
const STATUS_WEIGHTS = [0.4, 0.25, 0.08, 0.07, 0.2]

function weightedRandom(options, weights) {
  const r = Math.random()
  let sum = 0
  for (let i = 0; i < options.length; i++) {
    sum += weights[i]
    if (r <= sum) return options[i]
  }
  return options[options.length - 1]
}

/** Generate mock order data */
function generateOrder(index) {
  const date = faker.date.between({
    from: new Date("2025-01-01"),
    to: new Date("2026-03-14"),
  })
  const itemCount = faker.number.int({ min: 1, max: 5 })
  const items = Array.from({ length: itemCount }, () => ({
    name: faker.commerce.productName(),
    quantity: faker.number.int({ min: 1, max: 10 }),
    price: parseFloat(faker.commerce.price({ min: 20, max: 500 })),
  }))

  return {
    id: `PED-${String(index + 1).padStart(5, "0")}`,
    customer: faker.person.fullName(),
    email: faker.internet.email(),
    date: date.toISOString(),
    status: weightedRandom(STATUS_OPTIONS, STATUS_WEIGHTS),
    region: faker.helpers.arrayElement(REGION_OPTIONS),
    value: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    items,
    trackingCode: faker.string.alphanumeric({ length: 13, casing: "upper" }),
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.helpers.arrayElement(REGION_OPTIONS),
      zip: faker.location.zipCode("#####-###"),
    },
  }
}

// Generate 500 orders at module load
const allOrders = Array.from({ length: 500 }, (_, i) => generateOrder(i))

/**
 * Simulate network latency.
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 */
function delay(min = 400, max = 800) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch dashboard statistics computed from mock data.
 * @returns {Promise<object>} Dashboard stats with KPIs, sparklines, and chart data
 */
export async function fetchDashboardStats() {
  await delay(500, 1000)

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const recentOrders = allOrders.filter((o) => new Date(o.date) >= thirtyDaysAgo)
  const prevOrders = allOrders.filter((o) => {
    const d = new Date(o.date)
    return d >= sixtyDaysAgo && d < thirtyDaysAgo
  })

  const totalRevenue = recentOrders.reduce((sum, o) => sum + o.value, 0)
  const prevRevenue = prevOrders.reduce((sum, o) => sum + o.value, 0)
  const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0

  const pendingOrders = allOrders.filter(
    (o) => o.status === "Em Trânsito" || o.status === "Processando"
  ).length
  const prevPending = prevOrders.filter(
    (o) => o.status === "Em Trânsito" || o.status === "Processando"
  ).length
  const pendingChange = prevPending > 0 ? ((pendingOrders - prevPending) / prevPending) * 100 : 0

  const delayedOrders = allOrders.filter((o) => o.status === "Atrasado").length
  const delayRate = (delayedOrders / allOrders.length) * 100
  const prevDelayed = prevOrders.filter((o) => o.status === "Atrasado").length
  const prevDelayRate = prevOrders.length > 0 ? (prevDelayed / prevOrders.length) * 100 : 0
  const delayRateChange = prevDelayRate > 0 ? delayRate - prevDelayRate : 0

  const uniqueCustomers = new Set(recentOrders.map((o) => o.email)).size
  const prevCustomers = new Set(prevOrders.map((o) => o.email)).size
  const customersChange = prevCustomers > 0 ? ((uniqueCustomers - prevCustomers) / prevCustomers) * 100 : 0

  // Generate sparkline data (30 points)
  const sparklineRevenue = Array.from({ length: 30 }, (_, i) => {
    const dayOrders = recentOrders.filter((o) => {
      const d = new Date(o.date)
      const targetDate = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000)
      return d.toDateString() === targetDate.toDateString()
    })
    return dayOrders.reduce((sum, o) => sum + o.value, 0)
  })

  const sparklinePending = Array.from({ length: 30 }, () =>
    Math.floor(Math.random() * 20 + pendingOrders * 0.8)
  )
  const sparklineDelay = Array.from({ length: 30 }, () =>
    Math.max(0, delayRate + (Math.random() - 0.5) * 4)
  )
  const sparklineCustomers = Array.from({ length: 30 }, () =>
    Math.floor(Math.random() * 10 + uniqueCustomers * 0.4)
  )

  // Revenue chart data (monthly for 12 months)
  const revenueChartData = Array.from({ length: 12 }, (_, i) => {
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
    const monthOrders = allOrders.filter((o) => {
      const d = new Date(o.date)
      return d.getMonth() === targetMonth.getMonth() && d.getFullYear() === targetMonth.getFullYear()
    })
    return {
      month: targetMonth.toLocaleDateString("pt-BR", { month: "short" }),
      revenue: monthOrders.reduce((sum, o) => sum + o.value, 0),
      orders: monthOrders.length,
    }
  })

  // Status distribution for donut chart
  const statusDistribution = STATUS_OPTIONS.map((status) => ({
    name: status,
    value: allOrders.filter((o) => o.status === status).length,
  }))

  return {
    metrics: {
      totalRevenue: { value: totalRevenue, change: revenueChange, sparkline: sparklineRevenue },
      pendingOrders: { value: pendingOrders, change: pendingChange, sparkline: sparklinePending },
      delayRate: { value: delayRate, change: delayRateChange, sparkline: sparklineDelay },
      newCustomers: { value: uniqueCustomers, change: customersChange, sparkline: sparklineCustomers },
    },
    revenueChart: revenueChartData,
    statusDistribution,
  }
}

/**
 * Fetch paginated, filtered, and sorted orders.
 * @param {object} params
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {string} [params.status]
 * @param {string} [params.region]
 * @param {string} [params.search]
 * @param {string} [params.sortBy="date"]
 * @param {"asc"|"desc"} [params.sortOrder="desc"]
 * @returns {Promise<{ orders: object[], totalPages: number, totalItems: number }>}
 */
export async function fetchOrders({
  page = 1,
  limit = 10,
  status,
  region,
  search,
  sortBy = "date",
  sortOrder = "desc",
} = {}) {
  await delay(400, 700)

  let filtered = [...allOrders]

  if (status && status !== "all") {
    filtered = filtered.filter((o) => o.status === status)
  }
  if (region && region !== "all") {
    filtered = filtered.filter((o) => o.region === region)
  }
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        o.trackingCode.toLowerCase().includes(q)
    )
  }

  // Sort
  filtered.sort((a, b) => {
    let valA, valB
    switch (sortBy) {
      case "value":
        valA = a.value
        valB = b.value
        break
      case "customer":
        valA = a.customer.toLowerCase()
        valB = b.customer.toLowerCase()
        break
      case "status":
        valA = a.status
        valB = b.status
        break
      case "region":
        valA = a.region
        valB = b.region
        break
      case "date":
      default:
        valA = new Date(a.date).getTime()
        valB = new Date(b.date).getTime()
    }
    if (valA < valB) return sortOrder === "asc" ? -1 : 1
    if (valA > valB) return sortOrder === "asc" ? 1 : -1
    return 0
  })

  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / limit)
  const start = (page - 1) * limit
  const orders = filtered.slice(start, start + limit)

  return { orders, totalPages, totalItems }
}

/**
 * Get a single order by ID.
 * @param {string} id - Order ID
 * @returns {Promise<object|null>}
 */
export async function getOrderById(id) {
  await delay(200, 400)
  return allOrders.find((o) => o.id === id) || null
}

/**
 * Update an order's fields.
 * @param {string} id - Order ID
 * @param {object} data - Fields to update
 * @returns {Promise<object>}
 */
export async function updateOrder(id, data) {
  await delay(300, 500)
  const index = allOrders.findIndex((o) => o.id === id)
  if (index === -1) throw new Error("Pedido não encontrado")
  allOrders[index] = { ...allOrders[index], ...data }
  return allOrders[index]
}

/** Export constants for use in filters */
export { STATUS_OPTIONS, REGION_OPTIONS }
