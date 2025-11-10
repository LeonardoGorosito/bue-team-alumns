import Card from '../components/Card'
import Button from '../components/Button'


const mock = [
{ slug: 'fansly-master', title: 'Fansly Master', desc: 'Aprende a vender con algoritmo interno', price: 85000, currency: 'ARS' },
{ slug: 'fetichista-master', title: 'Fetichista Master', desc: 'Venta nicho, DM y catálogo', price: 120000, currency: 'ARS' },
]


export default function Courses() {
return (
<section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
{mock.map(c => (
<Card key={c.slug}>
<h3 className="text-lg font-medium">{c.title}</h3>
<p className="text-gray-600 mb-2">{c.desc}</p>
<div className="flex items-center justify-between">
<span className="font-semibold">{c.currency} ${c.price.toLocaleString('es-AR')}</span>
<a href={`/checkout?course=${c.slug}`}>
<Button>Comprar</Button>
</a>
</div>
</Card>
))}
</section>
)
}