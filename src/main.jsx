import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/bebas-neue'
import '@fontsource-variable/inter'
import '@fontsource/instrument-serif/400-italic.css'
import './index.css'
import App from './App.jsx'

// The admin page is only downloaded by someone who opens /admin.
const Admin = lazy(() => import('./admin/Admin.jsx'))
const isAdmin = window.location.pathname.startsWith('/admin')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
)