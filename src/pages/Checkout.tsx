import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Input } from '../components/Input'
import Button from '../components/Button'
import { toast } from 'sonner'
import { api } from '../lib/axios'


const schema = z.object({
buyerName: z.string().min(2),
buyerEmail: z.string().email(),
method: z.enum(['TRANSFER', 'MERCADOPAGO']),
})


type FormData = z.infer<typeof schema>


export default function Checkout() {
const [sp] = useSearchParams()
const course = sp.get('course') || ''
const nav = useNavigate()


const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
resolver: zodResolver(schema),
defaultValues: { method: 'TRANSFER' },
})


const onSubmit = async (data: FormData) => {
try {
// 1) crea orden
const { data: order } = await api.post('/orders', { ...data, courseSlug: course })


if (data.method === 'TRANSFER') {
toast.success('Orden creada. Subí tu comprobante en Mi cuenta → Mis compras.')
nav('/success')
} else {
// 2) MP preference
const { data: pref } = await api.post('/payments/mp/preference', { orderId: order.id })
window.location.href = pref.init_point
}
} catch (e: any) {
toast.error(e?.response?.data?.message || 'Error creando la orden')
}
}


return (
<section className="max-w-lg">
<h2 className="text-xl font-semibold mb-4">Checkout</h2>
<p className="text-sm text-gray-600 mb-4">Curso seleccionado: <b>{course || '—'}</b></p>
<form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
<div>
<label className="text-sm">Nombre completo</label>
<Input {...register('buyerName')} />
{errors.buyerName && <p className="text-xs text-red-600">{errors.buyerName.message}</p>}
</div>
<div>
<label className="text-sm">Email</label>
<Input type="email" {...register('buyerEmail')} />
{errors.buyerEmail && <p className="text-xs text-red-600">{errors.buyerEmail.message}</p>}
</div>
<div>
<label className="text-sm">Método de pago</label>
<select className="w-full rounded-md border px-3 py-2 text-sm" {...register('method')}>
<option value="TRANSFER">Transferencia</option>
<option value="MERCADOPAGO">Mercado Pago</option>
</select>
</div>
<Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Procesando…' : 'Confirmar'}</Button>
</form>
</section>
)
}