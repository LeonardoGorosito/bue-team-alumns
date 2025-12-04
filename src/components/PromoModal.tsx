import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const PromoModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const now = new Date();
    const deadline = new Date();
    deadline.setHours(23, 59, 59, 999);

    // Usamos una clave diferente para pruebas, puedes volver a 'seen_moonlit_promo_v1' después
    const hasSeenPromo = localStorage.getItem('seen_moonlit_promo_white_theme');

    if (!hasSeenPromo && now < deadline) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('seen_moonlit_promo_white_theme', 'true');
  };

  const handleNavigate = () => {
    handleClose();
    navigate('/courses/moonlite-lite-master');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300" 
        onClick={handleClose}
      />

      {/* Modal Container - FORZADO A FONDO BLANCO */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-blue-500/30 animate-in fade-in zoom-in duration-300 transform">
        
        {/* Botón Cerrar (X) - Color ajustado para fondo blanco */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>

        {/* Header Azul Superior (Se mantiene igual) */}
        <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-700 p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
             <svg className="w-full h-full" viewBox="0 0 100 100" fill="white">
                <circle cx="20" cy="20" r="1" />
                <circle cx="50" cy="10" r="1" />
                <circle cx="80" cy="40" r="2" />
                <circle cx="10" cy="80" r="1" />
             </svg>
          </div>

          <div className="relative z-10 flex justify-center mb-2">
            <div className="bg-white/10 p-3 rounded-full backdrop-blur-md shadow-lg border border-white/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
              </svg>
            </div>
          </div>
          
          <h3 className="relative z-10 text-white font-extrabold text-2xl tracking-tight">
            MASTER MOONLIT
          </h3>
          <p className="relative z-10 text-blue-200 text-xs uppercase font-semibold tracking-widest mt-1">
            Oferta Flash
          </p>
        </div>

        {/* Contenido Inferior - TEXTO OSCURO PARA FONDO BLANCO */}
        <div className="p-6 text-center space-y-5">
          <div className="space-y-2">
            {/* Texto principal en gris oscuro */}
            <p className="text-gray-800 text-lg">
              Esta oportunidad desaparecerá al dar las <span className="text-red-600 font-bold bg-red-100 px-1 rounded">00:00 hs</span>.
            </p>
            {/* Texto secundario en gris medio */}
            <p className="text-sm text-gray-600">
              Accede al contenido exclusivo y únete al equipo antes de que cierre la inscripción.
            </p>
          </div>

          {/* Botón de Acción Principal (Se mantiene azul) */}
          <button
            onClick={handleNavigate}
            className="group w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>Quiero mi acceso</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </button>
          
          {/* Botón secundario en gris para fondo blanco */}
          <button 
            onClick={handleClose}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            No me interesa por ahora
          </button>
        </div>
      </div>
    </div>
  );
};