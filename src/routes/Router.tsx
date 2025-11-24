import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register' 
import Account from '../pages/Account'
import AdminOrders from '../pages/AdminOrders'
import Success from '../pages/Success'
import Failure from '../pages/Failure'
import Checkout from '../pages/Checkout'
import ProtectedRoute from '../components/ProtectedRoute'
import MainLayout from '../components/MainLayout'
import { useAuth } from '../context/AuthContext'
import Courses from '../pages/Courses'
import CourseDetails from '../pages/CourseDetails'


/**
 * AuthGate: Protege las rutas públicas. Redirige a /account si ya está logueado.
 */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6">Cargando...</div>
  
  if (user) return <Navigate to="/account" replace />
  
  return <>{children}</> 
}


export function AppRouter() {
return (
  <Routes>
    
    {/* 1. RUTAS PÚBLICAS Y DE AUTENTICACIÓN (SIN NAVBAR) */}
    
    {/* La ruta raíz (/) redirige directamente al login */}
    <Route path="/" element={<Navigate to="/login" replace />} />
    
    {/* Rutas de Login y Register, envueltas en AuthGate para redirigir si ya hay sesión */}
    <Route 
        path="/login" 
        element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <AuthGate><Login /></AuthGate>
            </div>
        } 
    />
    <Route 
        path="/register" 
        element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <AuthGate><Register /></AuthGate>
            </div>
        } 
    />

    {/* 2. RUTAS PRIVADAS (CON LAYOUT / CON NAVBAR) */}
    {/* Todas estas rutas usan MainLayout, que contiene el Navbar */}
    <Route element={<MainLayout />}> 
      
      {/* Área privada (requiere autenticación) */}
      <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
      <Route path="/courses/:slug" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
      <Route path="/failure" element={<ProtectedRoute><Failure /></ProtectedRoute>} />
      

      {/* CRM solo admin (requiere autenticación Y rol ADMIN) */}
      <Route path="/admin/orders" element={<ProtectedRoute roles={["ADMIN"]}><AdminOrders /></ProtectedRoute>} />
      
    </Route>

    {/* Catch-all: Si ninguna ruta coincide, redirige al login */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
)
}