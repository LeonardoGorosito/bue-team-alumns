import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { api } from '../lib/axios'
import { PAYMENT_METHODS } from '../lib/paymentConfig'
import type { PaymentMethodKey } from '../lib/paymentConfig'
import Button from '../components/Button'

export default function Success() {
  const [params] = useSearchParams()
  const methodKey = params.get('method') as PaymentMethodKey
  const orderId = params.get('orderId')
  const payLink = params.get('payLink')
  
  // --- 1. DETECTAR SI ES PDF ---
  // Si payLink existe y termina en .pdf, activamos el modo "Instructivo"
  const isPdf = payLink?.toLowerCase().endsWith('.pdf')

  const [uploading, setUploading] = useState(false)
  const [fileSent, setFileSent] = useState(false)

  const config = methodKey ? PAYMENT_METHODS[methodKey] : null

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (!file || !orderId) {
      toast.error("No se seleccionó un archivo o la orden no es válida.")
      return
    }

    const formData = new FormData()
    formData.append('file', file) 

    setUploading(true)
    try {
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
        
        {/* Header */}
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
          {fileSent ? (
            <div className="text-center space-y-4">
                <p className="text-gray-600">Tu comprobante ha sido subido exitosamente.</p>
                <a href="/courses" className="block w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Volver a Cursos
                </a>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600 text-center text-sm">
                Sigue los pasos para completar tu compra:
              </p>

              {/* --- ZONA DE INFORMACIÓN DE PAGO --- */}
              
              {/* CASO A: Es un Link de Pago (Tipfunder) O un PDF (Naranja X) */}
              {payLink && (
                 <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
                    {/* Título dinámico */}
                    <h3 className="font-bold text-blue-900 mb-2">
                        {isPdf ? 'Paso 1: Descargar Instructivo' : 'Paso 1: Realizar Pago'}
                    </h3>
                    
                    <p className="text-sm text-blue-800 mb-4">
                        {isPdf 
                          ? 'Descarga el PDF, escanea el QR o usa los datos para transferir.' 
                          : `Haz clic abajo para pagar en ${config?.label}.`
                        }
                        <br/>
                        <span className="font-semibold">¡No cierres esta pestaña!</span> Debes volver para subir la captura.
                    </p>

                    <a 
    href={decodeURIComponent(payLink)} 
    target="_blank" 
    rel="noreferrer"
    // SI ES PDF, LE FORZAMOS EL NOMBRE CON EXTENSIÓN. SI NO, LO DEJAMOS UNDEFINED.
    download={isPdf ? "instructivo-naranjax.pdf" : undefined} 
>
    <Button className={`w-full justify-center text-white ${isPdf ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
       {isPdf ? 'Descargar PDF 📄' : 'Ir a Pagar ➜'}
    </Button>
</a>
                 </div>
              )}

              {/* CASO B: Es Manual (CBU, Crypto, etc) */}
              {config && config.type === 'MANUAL' && (
                <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 text-sm">
                  <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">{config.label}</h3>
                  {'data' in config && (
                    <div className="space-y-2 font-mono text-gray-700">
                        {Object.entries(config.data).map(([label, value]) => (
                            <div key={label} className="flex justify-between flex-wrap gap-2">
                                <span className="text-gray-500 uppercase text-xs">{label}:</span>
                                <span className="font-bold text-right select-all break-all">{value as string}</span>
                            </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* ADVERTENCIA (Para todos) */}
              {config?.warning && (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-3 text-xs text-amber-800">
                  ⚠️ {config.warning}
                </div>
              )}

              {/* --- ZONA DE SUBIDA (Siempre visible ahora) --- */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-center font-bold text-gray-900 mb-4">
                    {payLink ? 'Paso 2: Subir Comprobante' : 'Subir Comprobante'}
                </h3>
                
                <label className={`block w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${uploading ? 'bg-gray-100 border-gray-300' : 'border-blue-300 hover:bg-blue-50 hover:border-blue-500'}`}>
                  <input 
                    type="file" 
                    accept="image/*,application/pdf" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  <div className="flex flex-col items-center justify-center text-blue-600">
                    {uploading ? (
                        <span className="animate-pulse">Subiendo... 🔄</span>
                    ) : (
                        <>
                            <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                            <span className="font-semibold text-lg">Seleccionar archivo</span>
                            <span className="text-xs text-gray-400 mt-1">Soporta JPG, PNG, PDF</span>
                        </>
                    )}
                  </div>
                </label>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}