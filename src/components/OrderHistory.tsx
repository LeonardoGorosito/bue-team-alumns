import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { useNavigate } from 'react-router-dom'
import { PAYMENT_METHODS } from '../lib/paymentConfig'
import type { PaymentMethodKey } from '../lib/paymentConfig'
import Button from './Button'
import Loader from './Loader'

// Tipos para TS (ajustados a lo que devuelve Prisma)
type Order = {
  id: string
  status: 'PENDING' | 'PAID' | 'REJECTED' | 'CANCELLED'
  createdAt: string
  course: {
    title: string
    slug: string
  }
  payments: {
    method: string
    amount: number
    currency: string
  }[]
}

export default function OrderHistory() {
  const navigate = useNavigate()

  // 1. Fetch de datos
  const { data: orders, isLoading, isError } = useQuery<Order[]>({
    queryKey: ['my-orders'],
    queryFn: async () => {
      // AJUSTE AQUÍ: La ruta en tu backend es /orders/me
      const { data } = await api.get('/orders/me') 
      return data
    }
  })

  // 2. Lógica de "Rescate"
  const handleResumeOrder = (order: Order) => {
    // Buscamos el último método de pago que intentó usar
    const lastPayment = order.payments?.[0]
    
    // Si no hay pago registrado, por defecto mandamos a TIPFUNDER (o el que prefieras)
    const methodKey = (lastPayment?.method || 'TIPFUNDER') as PaymentMethodKey
    
    // Obtenemos la config para ver si hay link
    const config = PAYMENT_METHODS[methodKey]
    
    // Construimos la URL de rescate
    let url = `/success?orderId=${order.id}&method=${methodKey}`
    
    // Si es redirect, le volvemos a pasar el link para que pueda pagar
    if (config && config.type === 'REDIRECT') {
        url += `&payLink=${encodeURIComponent(config.link)}`
    }

    navigate(url)
  }

  if (isLoading) return <Loader text="Recuperando tus compras..." />

  if (isError) return <div className="p-8 text-center text-red-500">Error al cargar historial.</div>

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="text-4xl mb-4">🛒</div>
        <h3 className="text-lg font-medium text-gray-900">Aún no tienes pedidos</h3>
        <p className="text-gray-500 mb-4">¿Qué esperas para potenciar tus ventas?</p>
        <Button onClick={() => navigate('/courses')} className="bg-blue-600 text-white px-6">
          Ver Cursos
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Mis Pedidos</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4">Curso</th>
              <th className="px-6 py-4">Fecha</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {order.course.title}
                  <div className="text-xs text-gray-400 font-normal">#{order.id.slice(-6)}</div>
                </td>
                <td className="px-6 py-4">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    order.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 'PAID' ? '✅ Aprobado' : 
                     order.status === 'PENDING' ? '⏳ Pendiente' : '❌ Cancelado'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {/* SI ESTÁ PENDIENTE -> BOTÓN DE RESCATE */}
                  {order.status === 'PENDING' && (
                    <Button 
                      onClick={() => handleResumeOrder(order)}
                      className="text-xs px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    >
                      Continuar Pago / Subir 📤
                    </Button>
                  )}

                  {/* SI YA PAGÓ -> BOTÓN VER CURSO */}
                  {order.status === 'PAID' && (
                    <Button 
                        onClick={() => navigate(`/courses/${order.course.slug}`)}
                        className="text-xs px-3 py-2 bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    >
                      Acceder al curso ▶
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}