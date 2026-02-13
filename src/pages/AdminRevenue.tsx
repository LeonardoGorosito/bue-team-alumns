import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'
import Card from '../components/Card'
import { Input } from '../components/Input'
import Button from '../components/Button'
import Loader from '../components/Loader'

interface Revenue {
  id: string
  createdAt: string
  studentName: string
  studentEmail: string
  courseTitle: string
  amount: number
  currency: string
}

export default function AdminRevenue() {
  const [search, setSearch] = useState('')
  const [year, setYear] = useState('2025') // Por defecto 2025 para ver tus ventas actuales
  const [month, setMonth] = useState('TODOS')

  const { data: revenue, isLoading, refetch, isRefetching } = useQuery<Revenue[]>({
    queryKey: ['adminRevenue'],
    queryFn: async () => {
      const { data } = await api.get('/admin/revenue')
      return data
    }
  })

  // Lógica de filtrado
  const filteredData = useMemo(() => {
    if (!revenue) return []
    return revenue.filter(r => {
      const date = new Date(r.createdAt)
      const matchesSearch = 
        r.studentName.toLowerCase().includes(search.toLowerCase()) || 
        r.studentEmail.toLowerCase().includes(search.toLowerCase())
      
      const matchesYear = year === 'TODOS' || date.getFullYear().toString() === year
      const matchesMonth = month === 'TODOS' || (date.getMonth() + 1).toString() === month
      
      return matchesSearch && matchesYear && matchesMonth
    })
  }, [revenue, search, year, month])

  // Cálculo de totales
  const totals = useMemo(() => {
    return filteredData.reduce((acc, curr) => {
      if (curr.currency === 'ARS') acc.ars += curr.amount
      else acc.usd += curr.amount
      return acc
    }, { ars: 0, usd: 0 })
  }, [filteredData])

  if (isLoading) return <Loader text="Calculando finanzas..." />

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Ingresos</h1>
            <p className="text-gray-500">Seguimiento de ventas confirmadas (PAID)</p>
          </div>
          <Button 
            onClick={() => refetch()} 
            disabled={isRefetching}
            className="bg-white border border-gray-300 text-gray-700"
          >
            {isRefetching ? 'Actualizando...' : '↻ Recargar'}
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 border-l-4 border-green-500 bg-white">
            <div className="text-sm text-gray-500 font-medium">Total Recaudado ARS</div>
            <div className="text-3xl font-bold text-gray-900">${totals.ars.toLocaleString('es-AR')}</div>
          </Card>
          <Card className="p-6 border-l-4 border-blue-500 bg-white">
            <div className="text-sm text-gray-500 font-medium">Total Recaudado USD</div>
            <div className="text-3xl font-bold text-gray-900">U$D {totals.usd.toLocaleString()}</div>
          </Card>
          <Card className="p-6 border-l-4 border-purple-500 bg-white">
            <div className="text-sm text-gray-500 font-medium">Ventas en Periodo</div>
            <div className="text-3xl font-bold text-purple-600">{filteredData.length}</div>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="p-5 bg-white flex flex-col md:flex-row gap-4 items-end shadow-sm">
          <div className="flex-grow w-full">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Buscar Alumna</label>
            <Input 
              placeholder="Nombre o email..." 
              value={search} 
              onChange={(e: any) => setSearch(e.target.value)} 
            />
          </div>
          <div className="w-full md:w-32">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Año</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={year} 
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="TODOS">Todos</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
          <div className="w-full md:w-44">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Mes</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
              value={month} 
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="TODOS">Todos los meses</option>
              <option value="1">Enero</option>
              <option value="2">Febrero</option>
              <option value="3">Marzo</option>
              <option value="4">Abril</option>
              <option value="5">Mayo</option>
              <option value="6">Junio</option>
              <option value="7">Julio</option>
              <option value="8">Agosto</option>
              <option value="9">Septiembre</option>
              <option value="10">Octubre</option>
              <option value="11">Noviembre</option>
              <option value="12">Diciembre</option>
            </select>
          </div>
        </Card>

        {/* Tabla */}
        <Card className="bg-white overflow-hidden p-0 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b text-gray-700 uppercase text-xs font-bold">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Alumna</th>
                  <th className="px-6 py-4">Curso</th>
                  <th className="px-6 py-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length > 0 ? (
                  filteredData.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-500 font-mono">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{r.studentName}</div>
                        <div className="text-xs text-gray-400">{r.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold border border-blue-100">
                          {r.courseTitle}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        {r.currency === 'ARS' ? '$' : 'USD '} {r.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                      No hay ventas confirmadas para este periodo.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}