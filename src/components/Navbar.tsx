import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function Navbar() {
const { user, logout } = useAuth()
return (
<nav className="border-b bg-white">
<div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
<Link to="/" className="font-semibold">Cursos</Link>
<div className="flex items-center gap-4">
<Link to="/courses" className="hover:underline">Masters</Link>
{user?.role === 'ADMIN' && <Link to="/admin/orders" className="hover:underline">CRM</Link>}
{user ? (
<>
<Link to="/account" className="hover:underline">Mi cuenta</Link>
<button onClick={logout} className="text-sm text-gray-600">Salir</button>
</>
) : (
<Link to="/login" className="hover:underline">Ingresar</Link>
)}
</div>
</div>
</nav>
)
}