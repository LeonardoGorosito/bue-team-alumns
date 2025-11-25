import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Input } from '../components/Input'
import Button from '../components/Button'
import { toast } from 'sonner'
import { api } from '../lib/axios'
import { PAYMENT_METHODS } from '../lib/paymentConfig'
import type { PaymentMethodKey } from '../lib/paymentConfig'
// 1. Importamos useQuery y la función para buscar cursos
import { useQuery } from '@tanstack/react-query' 
import { fetchCourses, type Course } from './Courses' 
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

// --- SCHEMA DINÁMICO ---
const schema = z.object({
  buyerName: z.string().min(2, 'Ingresa tu nombre completo'),
  buyerEmail: z.string().email('Ingresa un email válido'),
  method: z.enum(Object.keys(PAYMENT_METHODS) as [string, ...string[]]),
})

type FormData = z.infer<typeof schema>

// 2. Definimos qué métodos son en DÓLARES (Ajusta esto según tu lógica de negocio)
const USD_METHODS = ['USDT', 'AIRTM', 'SKRILL','TIPFUNDER','PREX']; 

export default function Checkout() {
  const [sp] = useSearchParams()
  const courseSlug = sp.get('course') || '' // Renombro a courseSlug para mayor claridad
  const nav = useNavigate()

  // 3. Traemos la información de los cursos para saber los precios
  const { data: courses } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    // Opcional: staleTime para no refetchear a cada rato
    staleTime: 1000 * 60 * 5, 
  })


  const { user } = useAuth()


  // 4. Buscamos el curso seleccionado en la lista
  const selectedCourseData = courses?.find(c => c.slug === courseSlug)

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, // <--- AGRÉGALO AQUÍ
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { 
      method: 'TIPFUNDER' // Método por defecto
    },
  })

  const selectedMethod = watch('method') as PaymentMethodKey

  // 5. Lógica para calcular el precio a mostrar
  const isUsd = USD_METHODS.includes(selectedMethod);
  const currentPrice = isUsd ? selectedCourseData?.priceUsd : selectedCourseData?.price;
  const currentCurrency = isUsd ? 'USD' : 'ARS';

  const onSubmit = async (data: FormData) => {
    if (!courseSlug) {
      toast.error("No se ha seleccionado ningún curso")
      return
    }

    try {
      // Nota: Al backend le mandamos los datos. El backend debería validar el precio final,
      // pero aquí enviamos lo necesario para crear la orden.
      const { data: order } = await api.post('/orders', { 
        ...data, 
        courseSlug: courseSlug 
      })

      const config = PAYMENT_METHODS[data.method as PaymentMethodKey]

      if (config.type === 'REDIRECT') {
         nav(`/success?orderId=${order.id}&method=${data.method}&payLink=${encodeURIComponent(config.link)}`)
          } else {
          nav(`/success?orderId=${order.id}&method=${data.method}`)
            }

    } catch (e: any) {
      console.error(e) 
      toast.error(e?.response?.data?.message || 'Error creando la orden')
    }
  }

  // Si no ha cargado el curso aún, podríamos mostrar un spinner pequeño o esperar
  if (!selectedCourseData && courseSlug && courses) {
     // Opcional: Manejo si el slug es inválido
  }

  useEffect(() => {
    if (user) {
      // Unimos nombre y apellido porque tu base de datos los tiene separados
      // pero el input del checkout pide "Nombre completo"
      const fullName = `${user.name} ${user.lastname || ''}`.trim()
      
      setValue('buyerName', fullName)
      setValue('buyerEmail', user.email)
    }
  }, [user, setValue])

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
                  {/* Mostramos el Título real si existe, sino el slug */}
                  <p className="font-bold text-blue-900">
                    {selectedCourseData?.title || courseSlug || 'No seleccionado'}
                  </p>
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

                {/* Métodos de Pago */}
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
                  disabled={isSubmitting || !courseSlug}
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
                  <span className="font-medium text-right ml-4">
                    {selectedCourseData?.title || courseSlug}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Método</span>
                  <span className="font-medium">{PAYMENT_METHODS[selectedMethod as PaymentMethodKey]?.label}</span>
                </div>
              </div>

              {/* 6. AQUI MOSTRAMOS EL TOTAL DINÁMICO */}
              <div className="flex justify-between items-end mb-6">
                <span className="text-gray-900 font-bold text-lg">Total a pagar</span>
                <div className="text-right">
                  <span className="text-sm text-gray-500 font-medium mr-1">{currentCurrency}</span>
                  <span className="text-3xl font-bold text-blue-600">
                    {/* Formateo de moneda bonito */}
                    {currentPrice 
                      ? currentPrice.toLocaleString(isUsd ? 'en-US' : 'es-AR', { minimumFractionDigits: 0 }) 
                      : '---'}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-900">
                <p className="font-medium mb-2">Incluye:</p>
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>Acceso inmediato y de por vida</li>
                  <li>Actualizaciones futuras</li>
                  <li>Soporte directo</li>
                  {/* Opcional: Mostrar features reales del curso */}
                  {selectedCourseData?.features?.slice(0,2).map((f, i) => (
                     <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}