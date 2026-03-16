import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * @param  {...(string|undefined|null|boolean)} inputs - Class names
 * @returns {string} Merged class string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Brazilian Real currency.
 * @param {number} value - The value to format
 * @returns {string} Formatted currency string (e.g., "R$ 1.234,56")
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

/**
 * Format a Date object to pt-BR short date string.
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date (e.g., "14/03/2026")
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

/**
 * Format a number as a percentage.
 * @param {number} value - The value (0-100)
 * @param {number} [decimals=1] - Number of decimal places
 * @returns {string} Formatted percentage (e.g., "+12.3%")
 */
export function formatPercentage(value, decimals = 1) {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(decimals)}%`
}
