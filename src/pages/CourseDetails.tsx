import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCourses, type Course } from './Courses'
import Button from '../components/Button'
import ConfirmationModal from '../components/ConfirmationModal'

export default function CourseDetails() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const { data: courses, isLoading, isError } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })

  const course = courses?.find(c => c.slug === slug)

  const handleBuyClick = () => {
    setIsModalOpen(true)
  }

  const handleConfirmBuy = () => {
    if (course) {
      navigate(`/checkout?course=${course.slug}`)
    }
    setIsModalOpen(false)
  }

  // Valores por defecto por si la base de datos está vacía en estos campos
  const defaultLearningPoints = [
    "Contenido en preparación",
    "Próximamente más detalles"
  ]

  const defaultDescription = "La descripción detallada de este curso estará disponible muy pronto."

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles...</p>
        </div>
      </div>
    )
  }

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

  // Usamos los datos de la DB o los defaults si están vacíos
  const pointsToShow = (course.learningPoints && course.learningPoints.length > 0) 
    ? course.learningPoints 
    : defaultLearningPoints;

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

      <div className="max-w-4xl mx-auto">
        <nav className="flex mb-8 text-sm text-gray-500">
          <Link to="/courses" className="hover:text-blue-600 transition-colors">Cursos</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{course.title}</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header del curso */}
          <div className="bg-blue-600 p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/30 text-blue-50 text-xs font-semibold mb-4 border border-blue-400/30">
                Master Class
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-100 text-lg max-w-2xl leading-relaxed">
                {course.desc}
              </p>
            </div>
            
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          </div>

          <div className="p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Columna principal */}
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Lo que aprenderás</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {pointsToShow.map((item, i) => (
                      <div key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{item}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Descripción detallada</h2>
                  <div className="prose text-gray-600">
                    <p className="whitespace-pre-line">
                      {course.longDescription || defaultDescription}
                    </p>
                  </div>
                </section>
              </div>

              {/* Sidebar de compra */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 sticky top-8">
                  <div className="mb-6">
                    <p className="text-sm text-gray-500 mb-2">Precio total del curso</p>
                    
                    {/* --- AQUI ESTAN LOS PRECIOS DOBLES --- */}
                    <div className="space-y-1">
                      {/* Precio Principal (ARS) */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-gray-900">
                          ARS ${course.price.toLocaleString('es-AR')}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">pesos arg.</span>
                      </div>

                      {/* Divisor visual */}
                      <div className="flex items-center gap-2 text-gray-400 text-xs py-1">
                        <div className="h-px bg-gray-200 w-full"></div>
                        <span>o pagando en dólares</span>
                        <div className="h-px bg-gray-200 w-full"></div>
                      </div>

                      {/* Precio Secundario (USD) */}
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-green-600">
                          USD ${course.priceUsd}
                        </span>
                        <span className="text-sm text-gray-500 font-medium">dólares</span>
                      </div>
                    </div>
                    {/* ------------------------------------- */}
                  </div>

                  <div className="space-y-4">
                    <Button 
                      onClick={handleBuyClick}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg shadow-lg transition-all"
                    >
                      Comprar ahora
                    </Button>
                    
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mt-4">
                        Acceso inmediato tras el pago
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Acceso online 24/7</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>Certificado de finalización</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                      <span>Acceso de por vida</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}