import { useMemo, useState } from 'react' // <--- 1. IMPORTAR useState
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/axios'
import { useQuery } from '@tanstack/react-query'
import { PAYMENT_METHODS } from '../lib/paymentConfig'
import type { PaymentMethodKey } from '../lib/paymentConfig'
import CourseAccessModal from '../components/CourseAccessModal' // <--- 2. IMPORTAR EL MODAL

// Definimos el tipo para los links JSON
interface AccessLinkItem {
  title: string
  url: string
}

// Interfaz ajustada con los campos nuevos
interface Order {
  id: string
  status: 'PENDING' | 'PAID' | 'REJECTED' | 'CANCELLED'
  createdAt: string
  course: { 
    title: string
    slug: string
    // Campos para los links
    accessLink?: string | null 
    accessLinks?: AccessLinkItem[] | null 
  }
  payments: {
    method: string
    status: string
    receiptUrl: string | null
  }[]
}

const fetchMyOrders = async (): Promise<Order[]> => {
  const { data } = await api.get('/orders/me')
  return data
}

const isUnderReview = (order: Order) => {
  return order.status === 'PENDING' && order.payments.some(p => p.status === 'PENDING_REVIEW')
}

const getStatusBadge = (order: Order) => {
  if (isUnderReview(order)) {
    return (
      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 animate-pulse-slow">
        En Revisión 🔍
      </span>
    )
  }

  const styles = {
    PAID: "bg-green-100 text-green-700 border border-green-200",
    PENDING: "bg-amber-100 text-amber-700 border border-amber-200",
    REJECTED: "bg-red-100 text-red-700 border border-red-200",
    CANCELLED: "bg-gray-100 text-gray-700 border border-gray-200",
  }
  
  const labels = {
    PAID: "Aprobado",
    PENDING: "Pago Pendiente",
    REJECTED: "Rechazado",
    CANCELLED: "Cancelado"
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[order.status] || styles.CANCELLED}`}>
      {labels[order.status] || order.status}
    </span>
  )
}

export default function Account() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // 3. ESTADOS PARA EL MODAL
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCourseLinks, setSelectedCourseLinks] = useState<{ title: string, links: AccessLinkItem[] } | null>(null)

  const { data: orders, isLoading, refetch } = useQuery<Order[]>({
    queryKey: ['myOrders'],
    queryFn: fetchMyOrders,
    staleTime: 1000 * 60, 
  })

  const stats = useMemo(() => {
    if (!orders) return { totalPurchases: 0, activeCourses: 0, pending: 0 }
    return {
      totalPurchases: orders.length,
      activeCourses: orders.filter(o => o.status === 'PAID').length,
      pending: orders.filter(o => o.status === 'PENDING' && !isUnderReview(o)).length,
    }
  }, [orders])

  const handleResumeOrder = (order: Order) => {
    const lastPayment = order.payments?.[0]
    const methodKey = (lastPayment?.method || 'TIPFUNDER') as PaymentMethodKey
    const config = PAYMENT_METHODS[methodKey]
    
    let url = `/success?orderId=${order.id}&method=${methodKey}`
    if (config && config.type === 'REDIRECT') {
        url += `&payLink=${encodeURIComponent(config.link)}`
    }
    navigate(url)
  }

  // 4. LÓGICA INTELIGENTE DE ACCESO
  const handleAccessCourse = (order: Order) => {
    const { accessLinks, accessLink, slug, title } = order.course

    // A. Múltiples links (JSON) -> Abrir Modal
    if (accessLinks && Array.isArray(accessLinks) && accessLinks.length > 0) {
      setSelectedCourseLinks({ title, links: accessLinks })
      setModalOpen(true)
      return
    }

    // B. Un solo link externo (Legacy) -> Abrir directo
    if (accessLink) {
      window.open(accessLink, '_blank', 'noopener,noreferrer')
      return
    }

    // C. Sin link externo -> Navegación interna
    navigate(`/courses/${slug}`)
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-50">
      <div className="mx-auto max-w-5xl">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mi Cuenta</h1>
            <p className="text-gray-500 mt-1">Bienvenido de vuelta, {user?.name}</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-sm text-gray-600">
             Usuario: <span className="font-semibold text-gray-900">{user?.email}</span>
          </div>
        </div>

        {/* 5. MODAL (Renderizado Condicional) */}
        {selectedCourseLinks && (
          <CourseAccessModal 
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title={selectedCourseLinks.title}
            links={selectedCourseLinks.links}
          />
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-3">
           <Card className="bg-white border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Compras</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{isLoading ? '-' : stats.totalPurchases}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl"><span className="text-2xl">🛍️</span></div>
            </div>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cursos Activos</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{isLoading ? '-' : stats.activeCourses}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl"><span className="text-2xl">🎓</span></div>
            </div>
          </Card>
          <Card className="bg-white border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">A pagar</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{isLoading ? '-' : stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl"><span className="text-2xl">💳</span></div>
            </div>
          </Card>
        </div>

        {/* Tabla de Compras */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Mis Pedidos Recientes</h2>
            <button onClick={() => refetch()} disabled={isLoading} className="text-sm text-blue-600 font-medium">
              Actualizar
            </button>
          </div>

          {!orders || orders.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No tienes pedidos aún.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map(order => {
                const underReview = isUnderReview(order)

                return (
                  <div key={order.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    
                    {/* Info Orden */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{order.course.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Fecha: {new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400 font-mono">#{order.id.slice(-6)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      
                      {getStatusBadge(order)}

                      {/* --- 6. BOTÓN INTELIGENTE UNIFICADO --- */}
                      {order.status === 'PAID' && (
                        <button 
                          onClick={() => handleAccessCourse(order)}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 hover:text-blue-600 transition-all shadow-sm flex items-center gap-1"
                        >
                          Ir al Curso ↗
                        </button>
                      )}

                      {underReview && (
                        <div className="text-xs text-blue-600 font-medium px-3">
                          Verificando...
                        </div>
                      )}

                      {order.status === 'PENDING' && !underReview && (
                        <button 
                          onClick={() => handleResumeOrder(order)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                        >
                          Subir Comprobante 📤
                        </button>
                      )}

                       {order.status === 'REJECTED' && (
                        <a href="#" className="text-sm text-gray-500 underline">Ayuda</a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}