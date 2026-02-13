import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import { useNavigate } from 'react-router-dom'
import ConfirmationModal from '../components/ConfirmationModal'
import FanslyValidationModal from '../components/FanslyValidationModal'
import Loader from '../components/Loader'

export interface Course {
  id: string
  slug: string
  title: string
  desc: string
  price: number
  priceUsd: number
  currency: string
  isActive: boolean
  isComingSoon: boolean
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
  const [isFanslyModalOpen, setIsFanslyModalOpen] = useState(false)
  const [redirectPath, setRedirectPath] = useState<string>('')

  const { data: courses, isLoading, isError } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })

  // Maneja tanto el clic de "Comprar" como el de "Ver Detalles"
  const handleActionClick = (slug: string, type: 'buy' | 'details') => {
    const targetPath = type === 'buy' ? `/checkout?course=${slug}` : `/courses/${slug}`
    setRedirectPath(targetPath)

    // Si es el curso de Atlas, disparamos el modal especial de Fansly
    if (slug === 'master-en-atlas') {
      setIsFanslyModalOpen(true)
    } else {
      // Para otros cursos: si es comprar mostramos el modal estándar, si es detalles navegamos directo
      if (type === 'buy') {
        setIsModalOpen(true)
      } else {
        navigate(targetPath)
      }
    }
  }

  const handleConfirmAction = () => {
    if (redirectPath) {
      navigate(redirectPath)
    }
    setIsModalOpen(false)
    setIsFanslyModalOpen(false)
  }

if (isLoading) return <Loader fullScreen text="Cargando cursos..." />
  if (isError) return <div>Error al cargar los cursos...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmAction}
        title="Información Importante"
        message={
          <div className="space-y-2">
            <p>Si no estás al día con tu renovación, o si ya no sos alumna activa, no vas a poder acceder al contenido, incluso si realizás la compra.</p>
            <p className="font-bold">No se realizan reembolsos bajo ninguna circunstancia.</p>
          </div>
        }
        confirmText="Entendido, continuar"
      />

      <FanslyValidationModal 
        isOpen={isFanslyModalOpen}
        onClose={() => setIsFanslyModalOpen(false)}
        onConfirm={handleConfirmAction}
      />

      <div className="max-w-6xl mx-auto px-4 py-16">
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {courses && courses.length > 0 ? (
            courses.map(c => (
              <Card 
                key={c.slug} 
                className={`group relative bg-white border-0 shadow-lg transition-all duration-500 rounded-2xl overflow-hidden flex flex-col h-full ${c.isComingSoon ? 'opacity-90' : 'hover:shadow-2xl'}`}
              >
                <div className={`absolute top-0 left-0 w-full h-1 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${c.isComingSoon ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}></div>
                
                <div className="p-8 flex-grow">
                  <div className="flex items-center justify-between mb-6">
                    {c.isComingSoon ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-gray-100 text-gray-600 uppercase border border-gray-200">
                          Próximamente 🚀
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-blue-50 text-blue-700 uppercase">
                          Masterclass
                        </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-8">
                    {c.desc}
                  </p>

                  <div className="space-y-3 mb-8">
                    {(c.features && c.features.length > 0 ? c.features : [". . .", ". . ."]).map((feature, i) => (
                      <div key={i} className="flex items-start text-sm text-gray-700">
                        <svg className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${c.isComingSoon ? 'text-gray-400' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      {c.isComingSoon ? (
                          <p className="text-lg font-bold text-gray-500 italic">Precio por anunciar</p>
                      ) : (
                          <>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Inversión Total</p>
                            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
                                <span className="text-3xl font-bold text-gray-900">${c.priceUsd}</span>
                                <span className="text-sm font-medium text-gray-500">USD</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">o ${c.price.toLocaleString('es-AR')} ARS</p>
                          </>
                      )}
                    </div>

                    <div className="flex flex-col w-full sm:w-auto gap-3">
                      {c.isComingSoon ? (
                          <Button disabled className="w-full sm:w-auto justify-center bg-gray-300 text-gray-500 font-semibold px-6 py-3 rounded-xl cursor-not-allowed">
                            Próximamente
                          </Button>
                      ) : (
                          <Button 
                            onClick={() => handleActionClick(c.slug, 'buy')}
                            className="w-full sm:w-auto justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5"
                          >
                            Comprar Ahora
                          </Button>
                      )}
                      
                      <Button 
                        onClick={() => handleActionClick(c.slug, 'details')}
                        className="w-full sm:w-auto justify-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium px-6 py-3 rounded-xl transition-all"
                      >
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
               <p>No hay cursos disponibles</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}