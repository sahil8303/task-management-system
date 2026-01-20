import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// standard tailwind merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

// same as above but with time
export function formatDateTime(date: string | Date): string {
const d = new Date(date)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function isOverdue(date: string | Date): boolean { return new Date(date) < new Date() }

// gets the first 2 letters
export function getInitials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase()
    .slice(0, 2)
}

// grabbed this from internet
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// CSV export functionality
export function exportToCSV(tasks: unknown[], filename: string): void {
  const csvContent = convertToCSV(tasks)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
    link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// helper for the csv thing
function convertToCSV(data: unknown[]): string {
  if (!data || data.length === 0) return ''
  
  const headers = Object.keys(data[0] as object)
  const csvRows = []
  
  // headers
  csvRows.push(headers.join(','))
  
  for (const row of data) {
    const values = headers.map((header) => {
      const value = (row as Record<string, unknown>)[header]
      return typeof value === 'string' ? `"${value}"` : value
    })
    csvRows.push(values.join(','))
  }
  return csvRows.join('\n')
}

export function exportToJSON(tasks: unknown[], filename: string): void {
  const jsonContent = JSON.stringify(tasks, null, 2)
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
    link.style.visibility = 'hidden' // hide it
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}