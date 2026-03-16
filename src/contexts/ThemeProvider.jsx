import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
})

/**
 * Theme provider that persists user preference to localStorage
 * and applies the "dark" class to the HTML element.
 */
export function ThemeProvider({ children, defaultTheme = "system", storageKey = "logitrack-theme" }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(storageKey) || defaultTheme
    }
    return defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/**
 * Hook to access the current theme and theme setter.
 * @returns {{ theme: string, setTheme: (theme: string) => void }}
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
