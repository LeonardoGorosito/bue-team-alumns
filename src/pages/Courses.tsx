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
  price: number
  priceUsd: number
  currency: string
  isActive: boolean
  isComingSoon: boolean // <--- 1. AGREGAR ESTO AQUÍ
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

  // ... (Bloques de Loading y Error se mantienen igual) ...
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  if (isError) return <div>Error...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ... (ConfirmationModal y Hero se mantienen igual) ... */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBuy}
        title="Información Importante"
        message={<div>Si no estás al día con tu renovación, o si ya no sos alumna activa, no vas a poder acceder al contenido, incluso si realizás la compra.
No se realizan reembolsos bajo ninguna circunstancia.
Asegurate de tener tu renovación vigente antes de continuar.</div>}
        confirmText="Entendido, continuar"
      />

      <div className="max-w-6xl mx-auto px-4 py-16">
        
        {/* ... (Banner Oferta se mantiene igual) ... */}

        {/* Grid de Cursos */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {courses && courses.length > 0 ? (
            courses.map(c => (
              <Card 
                key={c.slug} 
                // Si es Coming Soon, le damos un estilo un poco más apagado o normal
                className={`group relative bg-white border-0 shadow-lg transition-all duration-500 rounded-2xl overflow-hidden flex flex-col h-full ${c.isComingSoon ? 'opacity-90' : 'hover:shadow-2xl'}`}
              >
                {/* Borde superior de color (Solo si NO es coming soon, o gris si lo es) */}
                <div className={`absolute top-0 left-0 w-full h-1 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ${c.isComingSoon ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`}></div>
                
                <div className="p-8 flex-grow">
                  <div className="flex items-center justify-between mb-6">
                    {/* BADGE DE ESTADO */}
                    {c.isComingSoon ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-gray-100 text-gray-600 uppercase border border-gray-200">
                          Próximamente 🚀
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-blue-50 text-blue-700 uppercase">
                          Masterclass
                        </span>
                    )}

                    {!c.isComingSoon && (
                        <div className="flex items-center text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                        </div>
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
                    
                    {/* PRECIO */}
                    <div className="text-center sm:text-left">
                      {c.isComingSoon ? (
                          // Si es coming soon, ocultamos el precio o mostramos un placeholder
                          <p className="text-lg font-bold text-gray-500 italic">
                            Precio por anunciar
                          </p>
                      ) : (
                          <>
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
                          </>
                      )}
                    </div>

                    {/* BOTONES */}
                    <div className="flex flex-col w-full sm:w-auto gap-3">
                      {c.isComingSoon ? (
                          // BOTÓN DESHABILITADO
                          <Button 
                            disabled
                            className="w-full sm:w-auto justify-center bg-gray-300 text-gray-500 font-semibold px-6 py-3 rounded-xl cursor-not-allowed"
                          >
                            Próximamente
                          </Button>
                      ) : (
                          // BOTÓN DE COMPRA
                          <Button 
                            onClick={() => handleBuyClick(c.slug)}
                            className="w-full sm:w-auto justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transition-all transform hover:-translate-y-0.5"
                          >
                            Comprar Ahora
                          </Button>
                      )}

                      {/* El botón de ver detalles puede seguir activo para generar hype */}
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
               <p>No hay cursos disponibles</p>
            </div>
          )}
        </section>

        {/* ... CTA ... */}
      </div>
    </div>
  )
}