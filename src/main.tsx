import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ChaosPanel } from '@/mocks/ChaosPanel'
import { FakeApiWarning } from '@/mocks/FakeApiWarning'

// Configure TanStack Query for API requests.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof Error && 'status' in error) {
          const status = Number(error.status)

          // Never retry client errors (4xx).
          if (status >= 400 && status < 500) {
            return false
          }
        }

        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
  },
})

// The fake API (MSW) must be listening before the app sends its first
// request, so start it first, then render.
async function startFakeApi(): Promise<boolean> {
  const { worker } = await import('./mocks/browser')
  await worker.start({ onUnhandledRequest: 'bypass', quiet: true })
  // A hard reload, or DevTools' "Bypass for network", skips the service
  // worker. Requests then reach Vite, which answers with index.html, and
  // every API call fails with "Unexpected token '<'". Check, and say so.
  const ping = await fetch('/api/__fake-api').catch(() => null)
  return ping?.headers.get('content-type')?.includes('application/json') ?? false
}

void startFakeApi().then((fakeApiAnswers) => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          {!fakeApiAnswers && <FakeApiWarning />}
          <App />
          {/* Development only: switches to make the fake API misbehave. */}
          {import.meta.env.DEV && <ChaosPanel />}
        </QueryClientProvider>
      </ThemeProvider>
    </StrictMode>,
  )
})