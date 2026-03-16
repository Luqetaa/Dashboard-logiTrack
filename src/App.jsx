import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/contexts/ThemeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { MainLayout } from "@/components/MainLayout"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"

// Lazy load pages for code-splitting
const DashboardPage = lazy(() => import("@/pages/DashboardPage"))
const OrdersPage = lazy(() => import("@/pages/OrdersPage"))
const TrackingPage = lazy(() => import("@/pages/TrackingPage"))
const ReportsPage = lazy(() => import("@/pages/ReportsPage"))
const SettingsPage = lazy(() => import("@/pages/SettingsPage"))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function PageLoader() {
  return (
    <div className="p-4">
      <LoadingSkeleton variant="metrics" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="logitrack-theme">
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route
                  index
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <DashboardPage />
                    </Suspense>
                  }
                />
                <Route
                  path="orders"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <OrdersPage />
                    </Suspense>
                  }
                />
                <Route
                  path="tracking"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <TrackingPage />
                    </Suspense>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <ReportsPage />
                    </Suspense>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <SettingsPage />
                    </Suspense>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

