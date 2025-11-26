
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Blue Team Alumns</h3>
            <p className="text-gray-600 text-sm mb-4 max-w-xs">
              Plataforma educativa para potenciar tus habilidades y transformar tu carrera profesional.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons Placeholder */}
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.48 2h-.165zm-3.77 1.733c-1.696.073-2.542.325-3.177.575a2.923 2.923 0 00-1.086.705 2.923 2.923 0 00-.705 1.086c-.25.635-.502 1.48-.575 3.177C2.93 10.27 2.923 10.65 2.923 12s.007 1.73.078 2.707c.073 1.696.325 2.542.575 3.177.228.585.534 1.057.959 1.482.425.425.897.731 1.482.959.635.25 1.48.502 3.177.575 1.12.05 1.54.05 2.707.05s1.587 0 2.707-.05c1.696-.073 2.542-.325 3.177-.575a2.923 2.923 0 001.086-.705 2.923 2.923 0 00.705-1.086c.25-.635.502-1.48.575-3.177.05-1.12.05-1.54.05-2.707s0-1.587-.05-2.707c-.073-1.696-.325-2.542-.575-3.177a2.923 2.923 0 00-.705-1.086 2.923 2.923 0 00-1.086-.705c-.635-.25-1.48-.502-3.177-.575-1.12-.05-1.54-.05-2.707-.05s-1.587 0-2.707.05zm1.232 0c1.12.05 1.54.05 2.707.05s1.587 0 2.707-.05c1.696-.073 2.542-.325 3.177-.575a2.923 2.923 0 001.086-.705 2.923 2.923 0 00.705-1.086c.25-.635.502-1.48.575-3.177.05-1.12.05-1.54.05-2.707s0-1.587-.05-2.707c-.073-1.696-.325-2.542-.575-3.177a2.923 2.923 0 00-.705-1.086 2.923 2.923 0 00-1.086-.705c-.635-.25-1.48-.502-3.177-.575-1.12-.05-1.54-.05-2.707-.05s-1.587 0-2.707.05z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Section 1 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/courses" className="text-gray-600 hover:text-blue-600">Cursos</Link></li>
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600">Sobre Nosotros</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-blue-600">Precios</Link></li>
            </ul>
          </div>

          {/* Links Section 2 */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-gray-600 hover:text-blue-600">Centro de Ayuda</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600">Contacto</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-blue-600">Términos y Condiciones</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} Blue Team Alumns. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
