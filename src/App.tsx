import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { AppRouter } from './routes/Router'
// 1. Importas el componente nuevo

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster richColors position="bottom-right" />
      
      {/* 2. Lo agregas aquí al final. 
          Como tiene position:fixed, flotará sobre todo lo demás. */}
      
    </AuthProvider>
  )
}