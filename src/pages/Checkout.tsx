import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Input } from '../components/Input'
import Button from '../components/Button'
import { toast } from 'sonner'
import { api } from '../lib/axios'
import  { PAYMENT_METHODS } from '../lib/paymentConfig'
import type { PaymentMethodKey } from '../lib/paymentConfig'

// --- SCHEMA DINÁMICO ---
// Esto asegura que Zod acepte solo las llaves que definimos en el config (USDT, AIRTM, etc.)
const schema = z.object({
  buyerName: z.string().min(2, 'Ingresa tu nombre completo'),
  buyerEmail: z.string().email('Ingresa un email válido'),
  method: z.enum(Object.keys(PAYMENT_METHODS) as [string, ...string[]]),
})

type FormData = z.infer<typeof schema>

export default function Checkout() {
  const [sp] = useSearchParams()
  const course = sp.get('course') || ''
  const nav = useNavigate()

  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { 
      method: 'TIPFUNDER' // Método por defecto
    },
  })

  const selectedMethod = watch('method') as PaymentMethodKey // Cast para que TS sepa que es una llave válida

  const onSubmit = async (data: FormData) => {
    if (!course) {
      toast.error("No se ha seleccionado ningún curso")
      return
    }

    try {
      // 1. Crear la orden en el Backend
      const { data: order } = await api.post('/orders', { 
        ...data, 
        courseSlug: course 
      })

      const config = PAYMENT_METHODS[data.method as PaymentMethodKey]

      // 2. Decidir qué hacer según el método
      if (config.type === 'REDIRECT') {
        // Caso Tipfunder: Redirigir a la web externa
        window.location.href = config.link
      } else {
        // Caso Manuales (USDT, Airtm, etc): Ir a la página de éxito interna
        // Pasamos el ID de orden y el método para mostrar los datos allá
        nav(`/success?orderId=${order.id}&method=${data.method}`)
      }

    } catch (e: any) {
      console.error(e)
      toast.error(e?.response?.data?.message || 'Error creando la orden')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar compra</h1>
          <p className="text-gray-600">Completa tus datos para acceder al curso</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMNA IZQUIERDA: FORMULARIO */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 md:p-8">
              
              {/* Curso seleccionado */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold">📚</span>
                </div>
                <div>
                  <p className="text-xs text-blue-700 font-medium">Curso seleccionado</p>
                  <p className="font-bold text-blue-900">{course || 'No seleccionado'}</p>
                </div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                
                {/* Datos Personales */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información personal</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre completo</label>
                      <Input {...register('buyerName')} placeholder="Ej: Juan Pérez" className="w-full" />
                      {errors.buyerName && <p className="text-xs text-red-600 mt-1">{errors.buyerName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input type="email" {...register('buyerEmail')} placeholder="juan@email.com" className="w-full" />
                      {errors.buyerEmail && <p className="text-xs text-red-600 mt-1">{errors.buyerEmail.message}</p>}
                    </div>
                  </div>
                </div>

                {/* Métodos de Pago (Generados automáticamente) */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Método de pago</h3>
                  <div className="space-y-3">
                    {(Object.entries(PAYMENT_METHODS) as [PaymentMethodKey, typeof PAYMENT_METHODS[PaymentMethodKey]][]).map(([key, config]) => (
                      <label 
                        key={key}
                        className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedMethod === key 
                            ? 'border-blue-600 bg-blue-50 shadow-sm' 
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input 
                          type="radio" 
                          value={key} 
                          {...register('method')}
                          className="mt-1 text-blue-600 focus:ring-blue-600"
                        />
                        <div className="ml-3 flex-1">
                          <span className="font-semibold text-gray-900 block">{config.label}</span>
                          <span className="text-sm text-gray-600 block">{config.description}</span>
                          
                          {/* ADVERTENCIA: Se muestra solo si está seleccionado y tiene warning */}
                          {selectedMethod === key && config.warning && (
                            <div className="mt-2 text-xs text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 animate-fadeIn">
                              ⚠️ {config.warning}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !course}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar compra'}
                </Button>
              </form>
            </div>
          </div>

          {/* COLUMNA DERECHA: RESUMEN */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen</h3>
              
              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Curso</span>
                  <span className="font-medium">{course}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método</span>
                  <span className="font-medium">{PAYMENT_METHODS[selectedMethod as PaymentMethodKey]?.label}</span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-900">
                <p className="font-medium mb-2">Incluye:</p>
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>Acceso inmediato y de por vida</li>
                  <li>Actualizaciones futuras</li>
                  <li>Soporte directo</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}