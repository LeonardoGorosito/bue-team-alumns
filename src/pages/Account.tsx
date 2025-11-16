import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card' // Asegúrate de que la ruta a Card sea correcta
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/axios'
import { useQuery } from '@tanstack/react-query'

// 1. Definimos el tipo de dato de la Orden
interface Order {
  id: string
  status: 'PENDING' | 'PAID' | 'REJECTED' | 'CANCELLED'
  createdAt: string
  course: { title: string }
  payments: {
    status: string
    receiptUrl: string | null
  }[]
}

// 2. Función que busca los datos (para React Query)
const fetchMyOrders = async (): Promise<Order[]> => {
  const { data } = await api.get('/orders/me') // Ruta que ya existe
  return data
}

// 3. Helper visual para el estado
const getStatusBadge = (status: Order['status']) => {
  switch (status) {
    case 'PAID':
      return <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-800">Aprobado</span>
    case 'PENDING':
      return <span className="px-2 py-0.5 rounded text-xs font-bold bg-yellow-100 text-yellow-800">Pendiente</span>
    case 'REJECTED':
      return <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800">Rechazado</span>
    default:
      return <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-800">Cancelado</span>
  }
}

export default function Account() {
  // 1. Obtenemos datos del usuario
  const { user } = useAuth()

  // 2. Usamos React Query para traer los datos
  const { data: orders, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['myOrders'], // Clave única para el caché
    queryFn: fetchMyOrders,
    staleTime: 1000 * 60, // 1 minuto de caché
  })

  // 3. Calculamos los stats
  const stats = useMemo(() => {
    if (!orders) return { totalPurchases: 0, activeCourses: 0, pending: 0 }
    return {
      totalPurchases: orders.length,
      activeCourses: orders.filter(o => o.status === 'PAID').length,
      pending: orders.filter(o => o.status === 'PENDING').length,
    }
  }, [orders])

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="mx-auto max-w-6xl">
        {/* Header con bienvenida */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Mi Cuenta</h1>
          <p className="text-gray-600">Gestiona tus compras y accede a tus cursos</p>
        </div>

        {/* --- SECCIÓN DE TARJETAS CORREGIDA --- */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
          
          {/* Card Total (con tu ícono) */}
          <Card className="bg-white border border-blue-100 transition-shadow hover:shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de compras</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.totalPurchases}
                </p>
              </div>
            </div>
          </Card>
          
          {/* Card Activos (con tu ícono) */}
          <Card className="bg-white border border-blue-100 transition-shadow hover:shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cursos activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.activeCourses}
                </p>
              </div>
            </div>
          </Card>
          
          {/* Card Pendientes (con tu ícono) */}
          <Card className="bg-white border border-blue-100 transition-shadow hover:shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.pending}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Card principal de información */}
        <Card className="bg-white border border-blue-100 shadow-lg">
          <div className="flex items-start space-x-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-600">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Bienvenida a tu panel de alumna, {user?.name || ''}
              </h3>
              <p className="mb-4 text-gray-600">
                Acá vas a ver tus compras, estados y podrás subir comprobantes de transferencia.
              </p>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Próximamente:</strong> Podrás ver el historial completo de tus órdenes, descargar facturas y gestionar tus accesos a los cursos.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* --- SECCIÓN "MIS COMPRAS" --- */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Mis Compras</h2>
            <button 
              onClick={() => refetch()} 
              disabled={isLoading}
              className="flex items-center font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              <svg className={`mr-1 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {isLoading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>

          {/* Lógica condicional: Loading, Error, Vacío, o Lista */}
          {isLoading ? (
            <Card className="border border-gray-200 bg-white text-center py-12">Cargando tus compras...</Card>
          ) : !orders || orders.length === 0 ? (
            // Tu código de "Aún no tenés compras"
            <Card className="border border-gray-200 bg-white">
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Aún no tenés compras
                </h3>
                <p className="mb-6 text-gray-600">
                  Cuando realices tu primera compra, la verás listada aquí
                </p>
                <Link 
                  to="/courses" 
                  className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Ver cursos disponibles
                </Link>
              </div>
            </Card>
          ) : (
            // LISTA REAL DE COMPRAS
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id} className="bg-white border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                       <span className="text-xl">📚</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{order.course.title}</h4>
                      <p className="text-sm text-gray-500">
                        Comprado el: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {getStatusBadge(order.status)}
                    {order.status === 'PAID' ? (
                      <Link to="#" className="w-full sm:w-auto text-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        Acceder al Curso
                      </Link>
                    ) : (
                      <span className="w-full sm:w-auto text-center rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-600">
                        Acceso Pendiente
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}