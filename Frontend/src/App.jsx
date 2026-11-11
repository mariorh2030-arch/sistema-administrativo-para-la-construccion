import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './features/login/Login.jsx'

// Descomenta estos conforme migres cada módulo:
// import SideBar from './Components/Layouts/SideBar'
// import Facturas from './features/Facturas/Pages/Facturas'
// import Obras from './features/Obras/Pages/Obras'
// import Proveedores from './features/Proveedores/Pages/Proveedores'
// import Cotizaciones from './features/Cotizaciones/Pages/Cotizaciones'

function App() {
  // Lee el token al iniciar, así no parpadea el login al recargar
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem('token')
  )

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
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-4">Sesión iniciada</h1>
              <button
                onClick={handleLogout}
                className="bg-gray-800 text-white px-4 py-2 rounded-xl"
              >
                Cerrar sesión
              </button>
            </div>
          }
        />
        {/* Cualquier otra ruta (ej. /login) regresa al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App