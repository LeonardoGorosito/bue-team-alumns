import { Toaster } from 'sonner'
import { AuthProvider } from './context/AuthContext'
import { AppRouter } from './routes/Router'
// import { PromoModal } from './components/PromoModal' 

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster richColors position="bottom-right" />
      {/* <PromoModal />  */}
      
    </AuthProvider>
  )
}