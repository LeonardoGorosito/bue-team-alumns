import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmationModal from '../components/ConfirmationModal'

export interface Course {
  id: string
  slug: string
  title: string
  desc: string
  price: number     // Precio ARS
  priceUsd: number  // Precio USD (Nuevo)
  currency: string
  isActive: boolean
  longDescription?: string 
  learningPoints?: string[]
  features?: string[]
}

export const fetchCourses = async (): Promise<Course[]> => {
  const { data } = await api.get('/courses')
  return data
}

export default function Courses() {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string | null>(null)

  const { data: courses, isLoading, isError } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })

  const handleBuyClick = (slug: string) => {
    setSelectedCourseSlug(slug)
    setIsModalOpen(true)
  }

  const handleConfirmBuy = () => {
    if (selectedCourseSlug) {
      navigate(`/checkout?course=${selectedCourseSlug}`)
    }
    setIsModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-xl font-medium text-gray-900">Cargando experiencia...</h2>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-red-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Algo salió mal</h2>
          <p className="text-gray-600 mb-6">No pudimos cargar los cursos en este momento.</p>
          <Button onClick={() => window.location.reload()} className="bg-gray-900 text-white hover:bg-gray-800">
            Intentar nuevamente
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBuy}
        title="Información Importante"
        message={
          <div className="space-y-4 text-left">
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-amber-700 font-medium">
                    Requisito de Membresía Activa
                  </p>
                  <p className="text-sm text-amber-600 mt-1">
                    Si no estás al día con tu renovación, no podrás acceder al contenido incluso si realizas la compra.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Por favor verifica tu estado antes de continuar. No se realizan reembolsos.
            </p>
          </div>
        }
        confirmText="Entendido, continuar"
      />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 tracking-wide uppercase">
            Formación Profesional
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
            Domina el Arte de las Ventas <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              High Ticket
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed mb-10">
            Programas intensivos diseñados para escalar tus resultados. Aprende estrategias probadas y metodologías avanzadas.
          </p>
          
          {/* Stats / Trust Indicators */}
          <div className="flex justify-center gap-8 text-gray-400 text-sm font-medium uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              Contenido Premium
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
              Acceso Inmendiato
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Banner Oferta */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-2xl mb-16">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
          
          <div className="relative p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex h-16 w-16 bg-white/20 backdrop-blur-sm rounded-2xl items-center justify-center flex-shrink-0 border border-white/30">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Oferta de Lanzamiento</h3>
                <p className="text-blue-100 text-lg max-w-xl">
                  Aprovecha precios especiales por tiempo limitado. Invierte en tu futuro hoy.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Disponible ahora
              </span>
            </div>
          </div>
        </div>

        {/* Grid de Cursos */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {courses && courses.length > 0 ? (
            courses.map(c => (
              <Card 
                key={c.slug} 
                className="group relative bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                <div className="p-8 flex-grow">
                  <div className="flex items-center justify-between mb-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-blue-50 text-blue-700 uppercase">
                      Masterclass
                    </span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {c.desc}
                  </p>

                  <div className="space-y-3 mb-8">
                    {(c.features && c.features.length > 0 ? c.features : [
                        "Videos HD y material descargable", 
                        "Acceso de por vida a actualizaciones", 
                        "Soporte prioritario personalizado"
                    ]).map((feature, i) => (
                      <div key={i} className="flex items-start text-sm text-gray-700">
                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-8 border-t border-gray-100 mt-auto">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="text-center sm:text-left">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Inversión Total</p>
                      <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                        <span className="text-3xl font-bold text-gray-900">
                          ${c.priceUsd}
                        </span>
                        <span className="text-sm font-medium text-gray-500">USD</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        o ${c.price.toLocaleString('es-AR')} ARS
                      </p>
                    </div>

                    <div className="flex flex-col w-full sm:w-auto gap-3">
                      <Button 
                        onClick={() => handleBuyClick(c.slug)}
                        className="w-full sm:w-auto justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5"
                      >
                        Comprar Ahora
                      </Button>
                      <Link to={`/courses/${c.slug}`} className="w-full sm:w-auto block">
                        <Button className="w-full justify-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium px-6 py-3 rounded-xl transition-all">
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <div className="inline-block p-4 rounded-full bg-gray-100 mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No hay cursos disponibles</h3>
              <p className="text-gray-500 mt-1">Vuelve a revisar más tarde para nuevas oportunidades.</p>
            </div>
          )}
        </section>

        {/* CTA Section */}
        <div className="mt-20 bg-gray-900 rounded-3xl p-8 sm:p-12 text-center sm:text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                ¿Necesitas ayuda para decidir?
              </h3>
              <p className="text-gray-400 max-w-xl text-lg">
                Nuestro equipo está listo para orientarte. Consulta por paquetes especiales y descuentos corporativos.
              </p>
            </div>
            <button className="flex-shrink-0 bg-white text-gray-900 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg">
              Contactar Soporte
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}