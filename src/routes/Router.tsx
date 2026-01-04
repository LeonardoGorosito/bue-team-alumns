import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Register from '../pages/Register' 
import Account from '../pages/Account'
import AdminOrders from '../pages/AdminOrders'
import AdminStudents from '../pages/AdminStudents' // <--- 1. IMPORTA LA PÁGINA AQUÍ
import Success from '../pages/Success'
import Failure from '../pages/Failure'
import Checkout from '../pages/Checkout'
import ProtectedRoute from '../components/ProtectedRoute'
import MainLayout from '../components/MainLayout'
import { useAuth } from '../context/AuthContext'
import Courses from '../pages/Courses'
import CourseDetails from '../pages/CourseDetails'
import Terms from '../pages/Terms'
import ForgotPassword from '../pages/ForgotPassword'
import ResetPassword from '../pages/ResetPassword'
import AdminRevenue from '../pages/AdminRevenue'

// ... (El componente AuthGate sigue igual) ...
function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="p-6">Cargando...</div>
  if (user) return <Navigate to="/account" replace />
  return <>{children}</> 
}

export function AppRouter() {
  return (
    <Routes>
      
      {/* 1. RUTAS PÚBLICAS */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
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

      {/* 2. RUTAS PRIVADAS (CON NAVBAR) */}
      <Route element={<MainLayout />}> 
        
        {/* Área privada general */}
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
        <Route path="/courses/:slug" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/failure" element={<ProtectedRoute><Failure /></ProtectedRoute>} />
        <Route path="/terms" element={<ProtectedRoute><Terms /></ProtectedRoute>} />
        

        {/* --- ÁREA ADMIN --- */}
        
        {/* Ventas */}
        <Route 
          path="/admin/orders" 
          element={<ProtectedRoute roles={["ADMIN"]}><AdminOrders /></ProtectedRoute>} 
        />
        
        {/* CRM Alumnas (ESTA ES LA LÍNEA QUE FALTABA) */}
        <Route 
          path="/admin/students" 
          element={<ProtectedRoute roles={["ADMIN"]}><AdminStudents /></ProtectedRoute>} 
        />

        {/* Recaudación */}
        <Route 
          path="/admin/revenue" 
          element={<ProtectedRoute roles={["ADMIN"]}><AdminRevenue /></ProtectedRoute>} 
        />
        
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/forgot-password" 
        element={ 
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">{/* Usamos AuthGate para que si ya está logueada no vea esto */}
        <AuthGate> <ForgotPassword /> </AuthGate>
      </div>
      }  />

      <Route 
    path="/reset-password" 
    element={
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <AuthGate>
         <ResetPassword />
      </AuthGate>
    </div>
  } 
/>
    </Routes>
  )
}