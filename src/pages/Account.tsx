import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/axios'

// Definimos el tipo de datos que esperamos de la API
type AccountStats = {
  totalPurchases: number
  activeCourses: number
  pending: number
}

export default function Account() {
  // 1. Obtenemos datos del usuario (nombre, email) del contexto
  const { user } = useAuth()

  // 2. Estados para las estadísticas y carga
  const [stats, setStats] = useState<AccountStats>({
    totalPurchases: 0,
    activeCourses: 0,
    pending: 0
  })
  const [loading, setLoading] = useState(false)

  // 3. Función para traer datos de la API
  const fetchAccountData = async () => {
    setLoading(true)
    try {
      // NOTA: Esta ruta '/account/stats' la crearemos en el backend en el siguiente paso.
      // Si falla (404), no romperá la página, solo mostrará ceros.
      const { data } = await api.get('/account/stats')
      setStats(data)
    } catch (error) {
      console.error("Error cargando estadísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  // 4. Cargar datos al montar el componente
  useEffect(() => {
    fetchAccountData()
  }, [])

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="mx-auto max-w-6xl">
        {/* Header con bienvenida */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Mi Cuenta</h1>
          <p className="text-gray-600">Gestiona tus compras y accede a tus cursos</p>
        </div>

        {/* Grid de estadísticas rápidas */}
        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
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
                  {loading ? '...' : stats.totalPurchases}
                </p>
              </div>
            </div>
          </Card>

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
                  {loading ? '...' : stats.activeCourses}
                </p>
              </div>
            </div>
          </Card>

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
                  {loading ? '...' : stats.pending}
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
                {/* Usamos el nombre real del usuario o un fallback */}
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

        {/* Sección de compras vacía */}
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Mis Compras</h2>
            <button 
              onClick={fetchAccountData} // Conectamos la función de actualizar
              disabled={loading}
              className="flex items-center font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50"
            >
              <svg className={`mr-1 h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>

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
              {/* Cambiado a Link de react-router para navegación real */}
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
        </div>
      </div>
    </div>
  )
}