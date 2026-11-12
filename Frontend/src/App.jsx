import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './features/login/Login.jsx'

// Descomenta estos conforme migres cada módulo:
import SideBar from './Components/Layouts/SideBar'
// import Facturas from './features/Facturas/Pages/Facturas'
import Obras from './features/Obras/pages/obras.jsx'
// import Proveedores from './features/Proveedores/Pages/Proveedores'
// import Cotizaciones from './features/Cotizaciones/Pages/Cotizaciones'

function App() {
  // Lee el token al iniciar, así no parpadea el login al recargar
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  )
  const [sidebarAbierto, setSidebarAbierto] = useState(false)
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <BrowserRouter>
  <div className="flex">
    <SideBar isOpen={sidebarAbierto} onToggle={() => setSidebarAbierto(!sidebarAbierto)} />
    <main className="flex-1 min-h-screen overflow-hidden">
      <Routes>
        <Route path="/" element={<Navigate to="/obras" replace />} />
        <Route path="/obras" element={<Obras />} />
        <Route path="*" element={<Navigate to="/obras" replace />} />
      </Routes>
    </main>
  </div>
</BrowserRouter>
  )
}

export default App