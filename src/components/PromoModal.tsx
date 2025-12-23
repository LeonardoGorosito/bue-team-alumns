import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Cambiamos la clave para que todas las alumnas lo vean aunque hayan visto el anterior
  const PROMO_KEY = 'promo_navidad_2024_v1';

  useEffect(() => {
    const hasSeenPromo = localStorage.getItem(PROMO_KEY);

    if (!hasSeenPromo) {
      // Un poco más de delay para que cargue bien la página antes del anuncio
      const timer = setTimeout(() => setIsOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(PROMO_KEY, 'true');
  };

  const handleNavigate = () => {
    handleClose();
    // Redirigir a los cursos o a una oferta específica
    navigate('/courses');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 font-sans">
      {/* Backdrop con un tono más festivo */}
      <div 
        className="absolute inset-0 bg-red-950/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-red-100 animate-in fade-in zoom-in duration-300 transform">
        
        {/* Botón Cerrar */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/5 hover:bg-black/10 text-gray-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>

        {/* Header Navideño (Rojo Navidad) */}
        <div className="bg-gradient-to-br from-red-600 via-red-500 to-red-700 p-8 text-center relative overflow-hidden">
          {/* Patrón de "Nieve" simplificado */}
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
             <svg className="w-full h-full" viewBox="0 0 100 100" fill="white">
                <circle cx="10" cy="10" r="1.5" />
                <circle cx="30" cy="40" r="1" />
                <circle cx="50" cy="20" r="1.5" />
                <circle cx="70" cy="60" r="1" />
                <circle cx="90" cy="30" r="1.5" />
                <circle cx="20" cy="80" r="1" />
                <circle cx="60" cy="90" r="1.2" />
             </svg>
          </div>

          <div className="relative z-10 flex justify-center mb-3">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-md border border-white/30 shadow-inner">
              {/* Icono de Regalo */}
              <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12v10H4V12"/>
                <path d="M2 7h20v5H2z"/>
                <path d="M12 22V7"/>
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
              </svg>
            </div>
          </div>
          
          <h3 className="relative z-10 text-white font-black text-3xl tracking-tight italic">
            ¡OFERTA NAVIDEÑA!
          </h3>
          <p className="relative z-10 text-red-100 text-sm font-bold uppercase tracking-widest mt-1">
            Santa llegó antes al Blue Team
          </p>
        </div>

        {/* Contenido */}
        <div className="p-8 text-center space-y-6">
          <div className="space-y-3">
            <h4 className="text-2xl font-bold text-gray-900">
              ¡Todo está rebajado! 🎁
            </h4>
            <p className="text-gray-600 leading-relaxed">
              Es el momento de invertir en tu futuro. Aprovecha nuestros descuentos exclusivos en todos los Masters por tiempo limitado.
            </p>
          </div>

          {/* Botón de Acción (Verde Navidad) */}
          <button
            onClick={handleNavigate}
            className="group w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-green-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <span>Ver Cursos con Descuento</span>
            <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
          
          <button 
            onClick={handleClose}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors font-medium"
          >
            Quizás más tarde
          </button>
        </div>
      </div>
    </div>
  );
};