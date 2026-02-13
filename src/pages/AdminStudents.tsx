import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

// --- TUS COMPONENTES ---
import Card from '../components/Card'
import { Input } from '../components/Input'
import Button from '../components/Button'
import Loader from '../components/Loader'

// Tipo de dato (Igual que antes)
interface Student {
  id: string
  name: string
  lastname: string
  email: string
  telegram?: string
  createdAt: string
  purchasedCourses: string[]
  totalSpent: number
}

export default function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState('')
  const [courseFilter, setCourseFilter] = useState('TODOS')

  // 1. Fetch de datos
  const { data: students, isLoading, refetch, isRefetching } = useQuery<Student[]>({
    queryKey: ['adminStudents'],
    queryFn: async () => {
      const { data } = await api.get('/admin/students')
      return data
    },
    staleTime: 1000 * 60 * 5 // 5 minutos
  })

  // 2. Lista de cursos única
  const allCoursesList = useMemo(() => {
    if (!students) return []
    const courses = new Set<string>()
    students.forEach(s => s.purchasedCourses.forEach(c => courses.add(c)))
    return Array.from(courses)
  }, [students])

  // 3. Filtros
  const filteredStudents = useMemo(() => {
    if (!students) return []

    return students.filter(student => {
      const fullName = `${student.name} ${student.lastname}`.toLowerCase()
      const searchLower = searchTerm.toLowerCase()
      
      const matchesSearch = 
        fullName.includes(searchLower) || 
        student.email.toLowerCase().includes(searchLower)

      const matchesCourse = 
        courseFilter === 'TODOS' || 
        student.purchasedCourses.includes(courseFilter)

      return matchesSearch && matchesCourse
    })
  }, [students, searchTerm, courseFilter])

  // Loading state inicial
  if (isLoading) return <Loader text="Cargando base de datos de alumnas..." />
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CRM Alumnas</h1>
            <p className="text-gray-500">Gestión de base de datos</p>
          </div>
          <Button 
            onClick={() => refetch()} 
            disabled={isRefetching}
            className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {isRefetching ? 'Actualizando...' : '↻ Actualizar Lista'}
          </Button>
        </div>

        {/* --- KPI CARDS (Usando tu componente Card) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Card className="bg-white p-6 border-l-4 border-l-blue-500">
             <div className="text-sm text-gray-500 mb-1 font-medium">Total Registradas</div>
             <div className="text-3xl font-bold text-gray-900">{students?.length || 0}</div>
           </Card>
           
           <Card className="bg-white p-6 border-l-4 border-l-green-500">
             <div className="text-sm text-gray-500 mb-1 font-medium">Clientas Activas</div>
             <div className="text-3xl font-bold text-green-600">
               {students?.filter(s => s.purchasedCourses.length > 0).length || 0}
             </div>
           </Card>

           <Card className="bg-white p-6 border-l-4 border-l-gray-300">
             <div className="text-sm text-gray-500 mb-1 font-medium">Leads (Sin compra)</div>
             <div className="text-3xl font-bold text-gray-600">
               {students?.filter(s => s.purchasedCourses.length === 0).length || 0}
             </div>
           </Card>
        </div>

        {/* --- FILTROS Y TABLA --- */}
        <Card className="bg-white overflow-hidden p-0">
          
          {/* Barra de Filtros */}
          <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Input Buscador (Usando tu componente Input) */}
            <div className="w-full md:w-96">
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                // Asumiendo que tu Input pasa el onChange. Si Input espera props nativos:
                onChange={(e: any) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
            </div>

            {/* Select Filtro (Estilizado manualmente para parecerse a tu Input) */}
            <div className="w-full md:w-auto flex items-center gap-3">
               <span className="text-sm font-medium text-gray-600 whitespace-nowrap hidden md:inline">Filtrar por:</span>
               <div className="relative w-full">
                 <select 
                   className="w-full md:w-64 appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
                   value={courseFilter}
                   onChange={(e) => setCourseFilter(e.target.value)}
                 >
                   <option value="TODOS">Todos los cursos</option>
                   {allCoursesList.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
                 {/* Flechita del select */}
                 <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                   <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                 </div>
               </div>
            </div>
          </div>

          {/* Tabla HTML (Dentro del Card) */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Alumna</th>
                  <th className="px-6 py-4">Contacto</th>
                  <th className="px-6 py-4">Cursos Adquiridos</th>
                  <th className="px-6 py-4">Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3 border border-blue-200">
                            {student.name.charAt(0).toUpperCase()}{student.lastname.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 capitalize">{student.name} {student.lastname}</div>
                            {student.purchasedCourses.length > 0 ? (
                               <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Clienta</span>
                            ) : (
                               <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Lead</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <a href={`mailto:${student.email}`} className="text-gray-600 hover:text-blue-600 hover:underline flex items-center gap-1.5 transition-colors">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                             {student.email}
                          </a>
                          {student.telegram && (
                            <a href={`https://t.me/${student.telegram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center gap-1.5 transition-colors text-xs">
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                              {student.telegram}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {student.purchasedCourses.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {student.purchasedCourses.map((c, i) => (
                              <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-semibold border border-blue-100">
                                {c}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Sin compras</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-16 text-center text-gray-500">
                      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                      </div>
                      No se encontraron alumnas con estos filtros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
            <span>Mostrando {filteredStudents.length} de {students?.length} registros</span>
          </div>
        </Card>

      </div>
    </div>
  )
}