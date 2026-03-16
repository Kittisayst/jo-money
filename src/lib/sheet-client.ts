import { GoogleSheetClient } from 'google-sheet-client-ts'

// CORS fix for Google Apps Script
if (typeof window !== 'undefined') {
  const originalFetch = window.fetch
  window.fetch = async (...args) => {
    let [resource, config] = args
    if (
      typeof resource === 'string' &&
      resource.includes('script.google.com') &&
      config?.method === 'POST'
    ) {
      // Change Content-Type to avoid CORS preflight
      config = {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'text/plain;charset=utf-8'
        }
      }
    }
    return originalFetch(resource, config)
  }
}

const client = new GoogleSheetClient({
  apiUrl: import.meta.env.VITE_SHEET_API_URL,
  sheetKey: import.meta.env.VITE_SHEET_KEY,
})

export default client
