import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../lib/axios'
import { PAYMENT_METHODS } from '../lib/paymentConfig'
import type { PaymentMethodKey } from '../lib/paymentConfig'

export default function Success() {
  const [params] = useSearchParams()
  const methodKey = params.get('method') as PaymentMethodKey
  const orderId = params.get('orderId')
  
  const [uploading, setUploading] = useState(false)
  const [fileSent, setFileSent] = useState(false)

  const config = methodKey ? PAYMENT_METHODS[methodKey] : null

  // Función para subir el archivo
  // Reemplaza tu función handleFileUpload con esta:
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    // 1. Verificación: ¿Existe el archivo y la orden?
    if (!file || !orderId) {
      toast.error("No se seleccionó un archivo o la orden no es válida.")
      return
    }

    // 2. Creamos el FormData
    const formData = new FormData()
    formData.append('file', file) // La llave 'file' es la que espera req.file()

    setUploading(true)
    try {
      
      // 3. LA LLAMADA A LA API (¡EL PUNTO CLAVE!)
      // Fíjate bien: NO hay un objeto '{ headers: ... }'
      // Axios pone los headers correctos (con el 'boundary') automáticamente
      // si solo le pasas el formData.
      
      await api.post(`/orders/${orderId}/receipt`, formData) 
      
      toast.success('¡Comprobante enviado! Lo revisaremos pronto.')
      setFileSent(true)

    } catch (error: any) {
  console.error(error)
  const msg = error?.response?.data?.message || 'Error al subir el comprobante'
  toast.error(msg)
} finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header Verde si ya envió, o Amarillo si falta pago */}
        <div className={`${fileSent ? 'bg-green-100' : 'bg-blue-50'} p-6 text-center transition-colors`}>
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
             <span className="text-3xl">{fileSent ? '🎉' : '⏳'}</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {fileSent ? '¡Comprobante Recibido!' : 'Orden Creada'}
          </h2>
          <p className="text-gray-600 mt-2">
            {fileSent 
              ? 'Te notificaremos cuando se apruebe tu acceso.' 
              : `Tu pedido #${orderId?.slice(-6)} espera confirmación.`}
          </p>
        </div>

        <div className="p-8">
          {/* Si ya envió el archivo, mostramos mensaje final */}
          {fileSent ? (
            <div className="text-center space-y-4">
                <p className="text-gray-600">Tu comprobante ha sido subido exitosamente.</p>
                <a href="/courses" className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">
                    Volver a Cursos
                </a>
            </div>
          ) : (
            // Si NO ha enviado, mostramos datos y botón
            config && config.type === 'MANUAL' ? (
            <div className="space-y-6">
              <p className="text-gray-600 text-center text-sm">
                Realiza el pago y sube la captura aquí:
              </p>

              {/* Caja de Datos de Pago */}
              <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 text-sm">
                <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">{config.label}</h3>
                
                {'data' in config && (
                  <div className="space-y-2 font-mono text-gray-700">
                      {Object.entries(config.data).map(([label, value]) => (
                          <div key={label} className="flex justify-between">
                              <span className="text-gray-500 uppercase text-xs">{label}:</span>
                              <span className="font-bold text-right select-all">{value as string}</span>
                          </div>
                      ))}
                  </div>
                )}
              </div>

              {/* ADVERTENCIA */}
              {config.warning && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 text-xs text-amber-800">
                  {config.warning}
                </div>
              )}

              {/* INPUT DE ARCHIVO */}
              <div className="mt-6">
                <label className={`block w-full p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${uploading ? 'bg-gray-100 border-gray-300' : 'border-blue-300 hover:bg-blue-50 hover:border-blue-500'}`}>
                  <input 
                    type="file" 
                    accept="image/*,application/pdf" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <div className="flex flex-col items-center justify-center text-blue-600">
                    {uploading ? (
                        <span>Subiendo... 🔄</span>
                    ) : (
                        <>
                            <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            <span className="font-semibold">Subir Comprobante</span>
                            <span className="text-xs text-gray-400 mt-1">(Imagen o PDF)</span>
                        </>
                    )}
                  </div>
                </label>
              </div>

            </div>
          ) : (
            <div className="text-center">
                <p>Revisa tu correo para instrucciones.</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}