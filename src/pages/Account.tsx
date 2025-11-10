import Card from '../components/Card'


export default function Account() {
// TODO: fetch GET /me/orders y mostrar tabla
return (
<section className="space-y-4">
<h2 className="text-xl font-semibold">Mi cuenta</h2>
<Card>
<p className="text-gray-600">Acá vas a ver tus compras, estados y podrás subir comprobantes de transferencia.</p>
</Card>
</section>
)
}