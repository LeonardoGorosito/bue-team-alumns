
interface LoaderProps {
  text?: string
  fullScreen?: boolean
  className?: string
}

export default function Loader({ 
  text = "Cargando...", 
  fullScreen = false,
  className = "" 
}: LoaderProps) {
  
  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Contenedor del Logo con Animación */}
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        {/* Anillo giratorio exterior */}
        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        
        {/* Logo Central */}
        <img 
          src="/img/logo-blu_7eam.png" 
          alt="Blue Team Loader" 
          className="w-12 h-12 object-contain animate-pulse" 
        />
      </div>

      {/* Texto de carga */}
      <p className="text-gray-500 font-medium text-lg animate-pulse tracking-wide">
        {text}
      </p>
    </div>
  )

  // Si es pantalla completa (ideal para Router o CourseDetails)
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    )
  }

  // Si es un loader parcial (ideal para paneles de admin o historial)
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center">
      {content}
    </div>
  )
}