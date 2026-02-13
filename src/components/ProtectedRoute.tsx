import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import type { ReactNode } from 'react'  
import Loader from './Loader';

export default function ProtectedRoute(
  { children, roles }: { children: ReactNode; roles?: Array<'STUDENT' | 'ADMIN'> }
) {
  const { user, loading } = useAuth()
  if (loading) return <Loader fullScreen text="Verificando sesión..." />

  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return <>{children}</>
}


