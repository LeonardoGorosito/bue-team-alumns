import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  
  return (
    <nav className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo y marca */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 group"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
            <img className="w-6 h-6 text-white" src="./public/img/logo-blu_7eam.png" alt="Logo" />
          </div>
          <span className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
            Blue 7eam
          </span>
        </Link>

        {/* Links de navegación */}
        <div className="flex items-center gap-2">
          {/* Link Masters */}
          <Link 
            to="/courses" 
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            Masters
          </Link>

          {/* Link CRM solo para admin */}
          {user?.role === 'ADMIN' && (
            <Link 
              to="/admin/orders" 
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all flex items-center"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              CRM
            </Link>
          )}

          {/* Separador */}
          <div className="w-px h-6 bg-gray-300 mx-2"></div>

          {/* Usuario autenticado */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Avatar y nombre */}
              <Link 
                to="/account" 
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="hidden md:inline">Mi cuenta</span>
              </Link>

              {/* Botón salir */}
              <button 
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden md:inline">Salir</span>
              </button>
            </div>
          ) : (
            /* Botón ingresar */
            <Link 
              to="/login" 
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm hover:shadow-md flex items-center"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}