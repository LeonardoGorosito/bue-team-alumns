import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Terms() {
  // Scrollear al inicio al abrir la página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* --- HEADER --- */}
        <div className="bg-blue-600 px-6 py-10 text-center sm:px-12">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Términos y Condiciones
          </h1>
          <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
            Normativa Legal, Política de Privacidad y Reglas de Convivencia de Blue Team.
          </p>
        </div>

        {/* --- CONTENIDO --- */}
        <div className="px-6 py-10 sm:px-12 space-y-12 text-gray-600 text-sm sm:text-base leading-relaxed text-justify">

          {/* 1. POLÍTICA DE PRIVACIDAD */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              1. POLÍTICA DE PRIVACIDAD Y DERECHOS DE AUTOR – LEY 11.723
            </h2>
            <p className="mb-4">
              De acuerdo con la Ley 11.723 de Derechos de Autor, queda estrictamente prohibida la difusión, reproducción, distribución o comercialización del material adquirido en este curso sin la autorización expresa de su titular.
            </p>
            <p className="mb-4 font-medium text-gray-800">
              Las clases y los contenidos proporcionados son de uso exclusivamente individual. En caso de detectarse cualquier incumplimiento de esta norma, se procederá a la eliminación inmediata y definitiva de la comunidad de trabajo, sin previo aviso y sin derecho a reembolso.
            </p>
            <p className="mb-2">Asimismo:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>No se permite compartir datos, estrategias ni métodos con personas ajenas al grupo.</li>
              <li>Cualquier vulneración de esta norma podrá dar lugar a acciones legales, incluyendo denuncias por violación de derechos de autor y apropiación indebida de propiedad intelectual.</li>
              <li>El curso no puede ser utilizado por terceros sin autorización previa. Si será gestionado por una asistente personal, este hecho debe ser notificado y autorizado antes del ingreso.</li>
            </ul>
            <p className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 text-blue-800 font-medium">
              El desconocimiento de estas normas no exime de su cumplimiento. Al acceder al curso, aceptas expresamente estas condiciones y te comprometes a respetarlas.
            </p>
          </section>

          {/* 2. POLÍTICA DE REEMBOLSOS */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              2. POLÍTICA DE REEMBOLSOS – IMPOSIBILIDAD DE SOLICITUD
            </h2>
            <p className="mb-4">
              Al acceder y/o adquirir cualquier curso, formación, Master o producto digital ofrecido por BlueTeam, el usuario acepta y reconoce que <strong className="text-gray-900">no existe posibilidad de reembolso bajo ninguna circunstancia</strong>, cualquiera sea el motivo que origine su solicitud.
            </p>
            <p className="mb-4">
              Esta política se establece de manera clara y expresa en virtud del principio de autonomía de la voluntad contractual conforme al Código Civil y Comercial de la Nación, así como a la normativa vigente en materia de comercio digital y propiedad intelectual.
            </p>
            <p className="mb-4">
              Dado que los cursos y Masters incluyen acceso inmediato a contenido digital protegido por la Ley 11.723, el usuario renuncia de forma expresa e irrevocable a cualquier reclamo de devolución, reversión de pago, compensación o reembolso total o parcial.
            </p>
            
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 space-y-4 my-6">
              <h3 className="font-bold text-gray-900">Cláusula de Aceptación General de Condiciones – BlueTeam</h3>
              <p>
                Mediante la presente, la persona firmante reconoce y acepta que este documento posee validez legal plena y es aplicable a todos los productos, servicios, cursos, Masters, plataformas, espacios de trabajo, canales de comunicación y cualquier otra prestación actual o futura ofrecida bajo la marca BlueTeam.
              </p>
              <p>
                La aceptación del presente implica conformidad expresa con las condiciones generales de uso, participación, permanencia, renovación, conducta y demás normativas internas, sin necesidad de firmar documentos adicionales para cada servicio.
              </p>
            </div>

            <h3 className="font-bold text-gray-900 mt-6 mb-2">Cláusula adicional para alumnas que adquieren nuevas Masters</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>No podrá acceder al material de la nueva Master adquirida hasta regularizar previamente la deuda correspondiente a la renovación pendiente.</li>
              <li>En caso de negarse a abonar dicha renovación, no se entregará ningún contenido, acceso, beneficio o material de la nueva compra.</li>
              <li>La falta de regularización de pagos no habilita reclamo, reembolso ni reversión de la compra realizada.</li>
            </ul>

            <h3 className="font-bold text-gray-900 mt-6 mb-2">Renuncia al derecho de revocación</h3>
            <p>
              De conformidad con lo establecido en el artículo 34 de la Ley de Defensa del Consumidor (Ley 24.240) y en concordancia con la Ley 11.723 de Propiedad Intelectual, el usuario reconoce y acepta expresamente que, al tratarse de un servicio que implica el acceso inmediato a contenido digital protegido por derechos de autor, no corresponde el derecho de revocación ni el plazo de arrepentimiento de diez (10) días previsto por la normativa.
            </p>
          </section>

          {/* 3. LIMITACIÓN DE RESPONSABILIDAD */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              3. DECLARACIÓN DE LIMITACIÓN DE RESPONSABILIDAD
            </h2>
            <p className="mb-4">
              Agustina Soledad Riera, en calidad de titular y responsable del curso y asesoría, declara expresamente que no asume responsabilidad alguna por eventuales problemas que puedan surgir a raíz de la publicación de contenido en las plataformas indicadas durante el transcurso de la capacitación.
            </p>
            <p className="mb-2">En particular, queda eximida de toda responsabilidad en los siguientes casos:</p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Filtraciones, accesos no autorizados o vulneraciones de seguridad ocurridas en plataformas de terceros.</li>
              <li>Errores técnicos, fallas de sistema o cualquier inconveniente derivado del uso de dichas plataformas.</li>
              <li>Consecuencias legales, económicas o comerciales que puedan surgir de la publicación de contenido en los sitios sugeridos durante la asesoría.</li>
            </ul>
          </section>

          {/* 4. DERECHO DE ADMISIÓN */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              4. DERECHO DE ADMISIÓN Y PERMANENCIA
            </h2>
            <p className="mb-4">
              Agustina Soledad Riera se reserva el derecho de admisión y permanencia, pudiendo aceptar o eliminar a cualquier persona que no cumpla con las normas de conducta y los principios morales establecidos en el Código Civil y Comercial de la Nación. Ley 26.370.
            </p>
            <p className="mb-4 font-semibold">
              Cualquier incumplimiento de estas condiciones podrá derivar en la expulsión inmediata sin previo aviso y sin derecho a reembolso.
            </p>
          </section>

          {/* 5. RESTRICCIONES Y NO COMPETENCIA */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              5. RESTRICCIONES DE ACCESO Y NO COMPETENCIA
            </h2>
            <p className="mb-4">
              Por la presente, se establece que no podrán acceder al curso:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-6">
              <li>Personas que realicen servicios de asistencia.</li>
              <li>Personas que actualmente dicten cursos, capacitaciones o asesorías en temáticas afines.</li>
              <li>Individuos que mantengan una relación directa, laboral, comercial o de colaboración con alguien que dicte cursos de contenido similar.</li>
            </ul>

            <div className="bg-red-50 p-5 rounded-lg border border-red-100">
              <h3 className="font-bold text-red-800 mb-2 uppercase text-sm tracking-wide">Cláusula de No Competencia</h3>
              <p className="mb-4 text-red-900">
                El participante se compromete a no utilizar los conocimientos adquiridos en Blue Team para desarrollar, ofrecer o comercializar cursos, asesorías, capacitaciones, programas, formaciones o servicios que constituyan competencia directa o indirecta con la actividad de Blue Team, durante un plazo de <strong>diez (10) años</strong> contados a partir de la fecha de ingreso o hasta <strong>cinco (5) años</strong> posteriores a la desvinculación definitiva.
              </p>
              <p className="text-red-900 font-medium">
                El incumplimiento dará lugar a acciones legales civiles y/o penales por violación a derechos de autor (Ley 11.723), competencia desleal y apropiación indebida.
              </p>
            </div>
          </section>

          {/* 6 & 7. RENOVACIONES Y PRECIOS */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-2 mb-4">
              6 y 7. RENOVACIONES Y PRECIOS
            </h2>
            <p className="mb-4">
              El usuario reconoce y acepta que la adquisición de un nuevo curso, formación o Master <strong>no modifica, altera ni reinicia la fecha de renovación</strong> previamente establecida. La fecha de renovación es única, fija y corresponde exclusivamente al curso inicial adquirido.
            </p>
            <h3 className="font-bold text-gray-900 mt-4 mb-2">Sobre el Precio:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Variación:</strong> El valor de las renovaciones no constituye un monto fijo e inalterable. Podrá ser ajustado mensualmente.</li>
              <li><strong>Notificación:</strong> Cualquier modificación en el precio será notificada con una antelación no menor a cinco (5) días corridos.</li>
              <li><strong>Aceptación Tácita:</strong> La permanencia en el servicio y/o el pago de la renovación implica la plena aceptación de los nuevos términos económicos.</li>
            </ul>
          </section>

          {/* NORMAS DE CONVIVENCIA */}
          <section className="bg-blue-900 text-white p-6 sm:p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center border-b border-blue-700 pb-4">
              NORMAS DE CONVIVENCIA EN BLUE TEAM
            </h2>
            <p className="mb-6 italic text-center text-blue-100">
              "En Blue Team, nos rodeamos de mujeres cultas, enfocadas en su crecimiento y con principios sólidos."
            </p>
            
            <div className="space-y-4 text-blue-50">
              <p>
                <strong>1. Respeto Absoluto:</strong> No toleraremos maltratos ni amenazas. Ante la primera falta de respeto, la persona involucrada será restringida y eliminada de inmediato.
              </p>
              <p>
                <strong>2. Trabajo en Equipo:</strong> Somos una comunidad unida. No aceptamos actitudes que vayan en contra de la colaboración.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-blue-700">
              <h3 className="font-bold text-lg mb-4 text-white">Causales de Expulsión Inmediata:</h3>
              <ul className="list-none space-y-2 text-sm">
                <li>🚫 Filtrar, divulgar o compartir contenidos del curso.</li>
                <li>🚫 Utilizar los conocimientos para dictar cursos externos (Competencia).</li>
                <li>🚫 Agredir, acosar u hostigar a otras participantes.</li>
                <li>🚫 Revelar información confidencial.</li>
                <li>🚫 Filtrar capturas de pantalla del social u otros canales internos.</li>
              </ul>
            </div>

            <p className="mt-8 text-center text-xs text-blue-300 uppercase tracking-widest">
              Toda controversia se someterá a la jurisdicción de los Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires.
            </p>
          </section>

          {/* BOTÓN VOLVER */}
          <div className="flex justify-center pt-8">
            <Link 
              to="/" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-all transform hover:scale-105"
            >
              Volver al Inicio
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}