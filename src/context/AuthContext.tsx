import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/axios'


type User = { id: string; email: string; name?: string; role: 'STUDENT' | 'ADMIN' }
type AgeType = number | undefined; 
type MasterListType = string[]; // Tipo para el array de Masters seleccionadas

type AuthCtx = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  // Definición de la función de registro (Acepta el array de Masters)
  register: (
    name: string,
    lastname: string,
    age: AgeType,
    telegram: string,
    master: MasterListType, 
    email: string,
    password: string
  ) => Promise<void>
}


const Ctx = createContext<AuthCtx | null>(null)


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (!t) return setLoading(false)
    api.get('/auth/me').then(r => setUser(r.data)).catch(() => {
      localStorage.removeItem('token')
    }).finally(() => setLoading(false))
  }, [])


  const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    const me = await api.get('/auth/me')
    setUser(me.data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  // Implementación de la función de registro
  const register = async (
    name: string,
    lastname: string,
    age: AgeType,
    telegram: string,
    master: MasterListType, // Implementación con el array de Masters
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      // Envía todos los datos, incluido el array de Masters, a la API
      const { data } = await api.post('/auth/register', { 
        name, 
        lastname, 
        age, 
        telegram, 
        master, 
        email, 
        password 
      });

      localStorage.setItem('token', data.token); 
      const me = await api.get('/auth/me');
      setUser(me.data);
      
    } catch (error) {
      throw error; 
    } finally {
      setLoading(false);
    }
  }


  // Se exportan las funciones login, logout y register en el contexto
  const value = useMemo(() => ({ user, loading, login, logout, register }), [user, loading])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}


export const useAuth = () => {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used within AuthProvider')
  return v
}