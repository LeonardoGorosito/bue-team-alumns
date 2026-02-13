import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCourses, type Course } from './Courses'
import Button from '../components/Button'
import ConfirmationModal from '../components/ConfirmationModal'
import FanslyValidationModal from '../components/FanslyValidationModal'
import Loader from '../components/Loader'

export default function CourseDetails() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFanslyModalOpen, setIsFanslyModalOpen] = useState(false)
  
  const { data: courses, isLoading, isError } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })

  const course = courses?.find(c => c.slug === slug)

  const handleBuyClick = () => {
    // Si estamos viendo el Master en Atlas, disparamos el modal de Fansly
    if (slug === 'master-en-atlas') {
      setIsFanslyModalOpen(true)
    } else {
      setIsModalOpen(true)
    }
  }

  const handleConfirmBuy = () => {
    if (course) {
      navigate(`/checkout?course=${course.slug}`)
    }
    setIsModalOpen(false)
    setIsFanslyModalOpen(false)
  }

if (isLoading) return <Loader fullScreen text="Preparando el contenido..." />

  if (isError || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-red-600 mb-2">Curso no encontrado</h2>
          <Link to="/courses">
            <Button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Volver a cursos
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const pointsToShow = (course.learningPoints && course.learningPoints.length > 0) 
    ? course.learningPoints 
    : ["Contenido en preparación", "Próximamente más detalles"];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBuy}
        title="IMPORTANTE — LEE ANTES DE COMPRAR"
        message={
          <div className="space-y-4 text-left">
            <p className="font-medium text-red-600">
              Si no estás al día con tu renovación, o si ya no sos alumna activa, no vas a poder acceder al contenido.
            </p>
            <p className="font-semibold">
              Asegurate de tener tu renovación vigente antes de continuar.
            </p>
          </div>
        }
        confirmText="Entendido, continuar"
      />

      <FanslyValidationModal 
        isOpen={isFanslyModalOpen}
        onClose={() => setIsFanslyModalOpen(false)}
        onConfirm={handleConfirmBuy}
      />

      <div className="max-w-4xl mx-auto">
        <nav className="flex mb-8 text-sm text-gray-500">
          <Link to="/courses" className="hover:text-blue-600 transition-colors">Cursos</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{course.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              {course.isComingSoon ? (
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-4 border border-white/30 tracking-wider uppercase">🚀 Próximamente</span>
              ) : (
                <span className="inline-block px-3 py-1 rounded-full bg-blue-500/30 text-blue-50 text-xs font-semibold mb-4 border border-blue-400/30">Master Class</span>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">{course.desc}</p>
            </div>
          </div>

          <div className="p-8 sm:p-12">
            
            {/* PARTE SUPERIOR (Grid original) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Lo que aprenderás</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pointsToShow.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <svg className={`w-5 h-5 mt-1 mr-3 flex-shrink-0 ${course.isComingSoon ? 'text-gray-400' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>
                {/* Aquí sacamos la descripción para que no se apriete */}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 sticky top-8">
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">{course.isComingSoon ? 'Estado del lanzamiento' : 'Precio total del curso'}</p>
                    {course.isComingSoon ? (
                        <p className="text-xl font-bold text-gray-400 italic">Precio por anunciar</p>
                    ) : (
                        <div className="space-y-1">
                            <span className="text-3xl font-bold text-gray-900">ARS ${course.price.toLocaleString('es-AR')}</span>
                            <div className="flex items-center gap-2 text-gray-400 text-xs py-1">
                                <div className="h-px bg-gray-200 w-full"></div><span>O</span><div className="h-px bg-gray-200 w-full"></div>
                            </div>
                            <span className="text-2xl font-bold text-green-600 block">USD ${course.priceUsd}</span>
                        </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {course.isComingSoon ? (
                        <Button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-lg cursor-not-allowed">Próximamente</Button>
                    ) : (
                        <Button onClick={handleBuyClick} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5">
                            Comprar ahora
                        </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* PARTE INFERIOR (Nueva sección ancho completo) */}
            <section className="w-full pt-8 border-t border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Descripción detallada</h2>
              <div className="prose prose-lg max-w-none text-gray-600 whitespace-pre-wrap leading-relaxed">
                {course.longDescription || "La descripción detallada de este curso estará disponible muy pronto."}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}