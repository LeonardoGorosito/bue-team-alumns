import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { api } from '../lib/axios'

// Definimos los tipos de datos que vienen del backend
interface Order {
  id: string
  buyerName: string
  buyerEmail: string
  status: 'PENDING' | 'PAID' | 'REJECTED' | 'CANCELLED'
  createdAt: string
  course: {
    title: string
    price: number
  }
  payments: {
    method: string
    receiptUrl: string | null
    amount: number
  }[]
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  // 1. Cargar las órdenes al entrar
  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/admin')
      setOrders(data)
    } catch (error) {
      console.error(error)
      toast.error('Error cargando órdenes. ¿Eres Admin?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // 2. Función para cambiar estado (Aprobar/Rechazar)
  const handleStatusChange = async (orderId: string, newStatus: 'PAID' | 'REJECTED') => {
    if (!confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) return

    setProcessingId(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus })
      toast.success(`Orden ${newStatus === 'PAID' ? 'Aprobada' : 'Rechazada'} correctamente`)
      fetchOrders() // Recargamos la lista
    } catch (error) {
      toast.error('Error actualizando la orden')
    } finally {
      setProcessingId(null)
    }
  }

  // Función para ver el comprobante en una pestaña nueva
  const viewReceipt = (url: string) => {
    const fullUrl = `http://localhost:3000${url}` 
    window.open(fullUrl, '_blank')
  }

  if (loading) return <div className="p-10 text-center">Cargando panel...</div>

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-8">
          Administración de Ventas
        </h1>

        {/* Vista de tabla para desktop */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-100 text-gray-700 uppercase font-bold text-xs">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Cliente</th>
                  <th className="px-6 py-4">Curso</th>
                  <th className="px-6 py-4">Pago / Comprobante</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                      <br />
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{order.buyerName}</div>
                      <div className="text-blue-600">{order.buyerEmail}</div>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {order.course.title}
                      <div className="text-xs text-gray-500">
                        ${(order.course.price / 100).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {order.payments.length > 0 ? (
                        order.payments.map((p, i) => (
                          <div key={i} className="mb-1">
                            <span className="text-xs font-bold mr-2">{p.method}</span>
                            {p.receiptUrl ? (
                              <button 
                                onClick={() => viewReceipt(p.receiptUrl!)}
                                className="text-blue-600 hover:underline text-xs flex items-center gap-1"
                              >
                                📎 Ver foto
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">(Sin foto)</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status === 'PAID' ? 'APROBADO' : 
                         order.status === 'PENDING' ? 'PENDIENTE' : 'RECHAZADO'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {order.status === 'PENDING' && (
                        <>
                          <button
                            disabled={!!processingId}
                            onClick={() => handleStatusChange(order.id, 'PAID')}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            Aprobar
                          </button>
                          <button
                            disabled={!!processingId}
                            onClick={() => handleStatusChange(order.id, 'REJECTED')}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                      {order.status === 'PAID' && (
                        <span className="text-green-600 text-sm font-medium">✓ Completado</span>
                      )}
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                      No hay órdenes registradas todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vista de tarjetas para móvil y tablet */}
        <div className="lg:hidden space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              {/* Header con fecha y estado */}
              <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-200">
                <div className="text-xs text-gray-500">
                  <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                  <div>{new Date(order.createdAt).toLocaleTimeString()}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                  order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.status === 'PAID' ? 'APROBADO' : 
                   order.status === 'PENDING' ? 'PENDIENTE' : 'RECHAZADO'}
                </span>
              </div>

              {/* Cliente */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-500 mb-1">CLIENTE</div>
                <div className="font-medium text-gray-900">{order.buyerName}</div>
                <div className="text-sm text-blue-600">{order.buyerEmail}</div>
              </div>

              {/* Curso */}
              <div className="mb-3">
                <div className="text-xs font-semibold text-gray-500 mb-1">CURSO</div>
                <div className="font-medium text-gray-900">{order.course.title}</div>
                <div className="text-sm text-gray-600">
                  ${(order.course.price / 100).toFixed(2)}
                </div>
              </div>

              {/* Comprobante */}
              <div className="mb-4">
                <div className="text-xs font-semibold text-gray-500 mb-1">COMPROBANTE</div>
                {order.payments.length > 0 ? (
                  order.payments.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded">
                        {p.method}
                      </span>
                      {p.receiptUrl ? (
                        <button 
                          onClick={() => viewReceipt(p.receiptUrl!)}
                          className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                        >
                          📎 Ver foto
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">(Sin foto)</span>
                      )}
                    </div>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No hay pagos registrados</span>
                )}
              </div>

              {/* Botones de acción */}
              {order.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    disabled={!!processingId}
                    onClick={() => handleStatusChange(order.id, 'PAID')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    ✓ Aprobar
                  </button>
                  <button
                    disabled={!!processingId}
                    onClick={() => handleStatusChange(order.id, 'REJECTED')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    ✕ Rechazar
                  </button>
                </div>
              )}
              {order.status === 'PAID' && (
                <div className="text-center text-green-600 font-medium py-2">
                  ✓ Orden Completada
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              No hay órdenes registradas todavía.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}