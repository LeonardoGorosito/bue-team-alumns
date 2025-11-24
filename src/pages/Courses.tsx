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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-12 h-12 text-blue-600 animate-spin mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-blue-800">Cargando cursos...</h2>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8 px-4 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-red-600">Ups... algo salió mal</h2>
          <p className="text-gray-600 mt-2">No pudimos cargar los cursos. Por favor, intenta de nuevo más tarde.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBuy}
        title="IMPORTANTE — LEE ANTES DE COMPRAR"
        message={
          <div className="space-y-4 text-left">
            <p className="font-medium text-red-600">
              Si no estás al día con tu renovación, o si ya no sos alumna activa, no vas a poder acceder al contenido, incluso si realizás la compra.
            </p>
            <p>
              No se realizan reembolsos bajo ninguna circunstancia.
            </p>
            <p className="font-semibold">
              Asegurate de tener tu renovación vigente antes de continuar.
            </p>
          </div>
        }
        confirmText="Entendido, continuar"
      />

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Masters Disponibles</h1>
          <p className="text-gray-600">Elige el curso perfecto para potenciar tus ventas</p>
        </div>

        <div className="bg-blue-600 text-white rounded-lg p-4 mb-8 flex items-center space-x-3 shadow-lg">
           <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
             <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
           </div>
           <div>
             <p className="font-semibold">Oferta de lanzamiento</p>
             <p className="text-sm text-blue-100">Aprovechá los precios especiales disponibles ahora</p>
           </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses && courses.length > 0 ? (
            courses.map(c => (
              <Card 
                key={c.slug} 
                className="bg-white border border-blue-100 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    <svg className="w-3.5 h-3.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Master
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Acceso inmediato</span>
                </div>

                <div className="mb-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                    {c.title}
                    <svg className="w-5 h-5 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{c.desc}</p>
                </div>

                <div className="mb-5 space-y-2 bg-gray-50 rounded-lg p-3">
                   <div className="flex items-center text-sm text-gray-700">
                     <svg className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                     Videos HD y material descargable
                   </div>
                   <div className="flex items-center text-sm text-gray-700">
                     <svg className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                     Acceso de por vida
                   </div>
                   <div className="flex items-center text-sm text-gray-700">
                     <svg className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                     </svg>
                     Soporte personalizado
                   </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Precio total</p>
                    <div className="flex flex-col">
                      {/* PRECIO EN PESOS */}
                      <span className="text-2xl font-bold text-blue-600">
                        ARS ${c.price.toLocaleString('es-AR')}
                      </span>
                      {/* PRECIO EN DOLARES */}
                      <span className="text-sm font-medium text-gray-500">
                        o USD ${c.priceUsd}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link to={`/courses/${c.slug}`}>
                      <Button className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 font-medium px-4 py-3 rounded-lg transition-all">
                        Más información
                      </Button>
                    </Link>

                    <Button 
                      onClick={() => handleBuyClick(c.slug)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all flex items-center"
                    >
                      Comprar
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Button>
                  </div>
                  
                </div>
              </Card>
            ))
          ) : (
            <div className="md:col-span-2 text-center bg-white p-8 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800">No hay cursos disponibles</h3>
              <p className="text-gray-600 mt-2">Vuelve a intentarlo más tarde.</p>
            </div>
          )}
        </section>

        <div className="mt-8 bg-white border border-blue-100 rounded-lg p-6 shadow-sm">
           <div className="flex items-start space-x-4">
             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
               <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>
             <div>
               <h3 className="font-semibold text-gray-900 mb-2">¿Tenés dudas sobre qué master elegir?</h3>
               <p className="text-sm text-gray-600 mb-3">
                 Podés comprar ambos cursos y obtener un descuento especial. Contactanos para más información sobre paquetes combinados.
               </p>
               <button className="text-sm text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
                 Contactar ahora
                 <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                 </svg>
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}