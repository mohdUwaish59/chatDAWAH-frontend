"use client"

/**
 * Debug component to show which API URL is being used
 * Add this temporarily to your page to verify the connection
 */
export default function DebugApiUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-500 rounded-lg p-4 shadow-lg z-50 max-w-md">
      <div className="text-sm font-mono">
        <div className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">
          🔍 API Connection Debug
        </div>
        <div className="space-y-1 text-yellow-900 dark:text-yellow-100">
          <div>
            <span className="font-semibold">API URL:</span>
            <div className="bg-white dark:bg-gray-800 p-2 rounded mt-1 break-all">
              {apiUrl}
            </div>
          </div>
          <div className="text-xs mt-2 text-yellow-700 dark:text-yellow-300">
            Expected: http://localhost:8000
          </div>
        </div>
      </div>
    </div>
  )
}
