import { useEffect, useState } from 'react'

interface LinkItem {
  title: string
  url: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  links: LinkItem[]
}

export default function CourseAccessModal({ isOpen, onClose, title, links }: Props) {
  const [show, setShow] = useState(false)

  // Efecto para la animación de entrada
  useEffect(() => {
    if (isOpen) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Backdrop (Fondo oscuro) */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      ></div>

      {/* Contenido del Modal */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 ${show ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
      >
        
        {/* Botón Cerrar (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8 pt-2">
          <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
            <span className="text-3xl">🚀</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 leading-tight">
            Acceder a <br/>
            <span className="text-blue-600">{title}</span>
          </h3>
          <p className="text-sm text-gray-500 mt-2">
            Selecciona una de las siguientes opciones para ingresar al contenido.
          </p>
        </div>

        {/* Lista de Botones */}
        <div className="space-y-3">
          {links.map((link, idx) => {
            // Lógica simple para iconos según el título
            const titleLower = link.title.toLowerCase()
            let icon = '🔗'
            if (titleLower.includes('telegram')) icon = '✈️'
            else if (titleLower.includes('drive')) icon = '📂'
            else if (titleLower.includes('zoom') || titleLower.includes('vivo')) icon = '📹'
            else if (titleLower.includes('grabación')) icon = '📼'

            return (
              <a 
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose} // Cerramos el modal al hacer clic para que no quede abierto al volver
                className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-xl transition-all duration-200 group hover:shadow-sm"
              >
                <div className="flex items-center">
                  <span className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-xl shadow-sm mr-4 group-hover:scale-110 transition-transform">
                    {icon}
                  </span>
                  <div className="text-left">
                    <span className="block font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                      {link.title}
                    </span>
                    <span className="text-xs text-gray-400 group-hover:text-blue-400">Clic para abrir</span>
                  </div>
                </div>
                <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400">
            ¿Problemas para ingresar? <a href="https://t.me/SOPORTE" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Contactar soporte</a>
          </p>
        </div>
      </div>
    </div>
  )
}