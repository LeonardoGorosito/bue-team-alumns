import { useForm, Controller } from 'react-hook-form'
import type { SubmitHandler, Resolver } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Select from 'react-select'
import { Input } from '../components/Input'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'

// --- CAMBIO 1: Importamos useQuery y la función fetchCourses ---
import { useQuery } from '@tanstack/react-query'
import { fetchCourses } from './Courses' // Asumiendo que están en la misma carpeta, ajusta la ruta si es necesario
// -------------------------------------------------------------

// --- CAMBIO 2: Borramos MASTER_OPTIONS hardcodeado ---
// Ya no necesitamos la constante fija aquí
// ----------------------------------------------------

const schema = z.object({
  name: z.string().min(2, 'El nombre completo es obligatorio y debe tener al menos 2 caracteres'),
  lastname: z.string().min(2, 'El apellido es obligatorio'),
  telegram: z.string().regex(/^@?(\w){5,}/, 'El usuario de Telegram no es válido (ej: @miusuario)'),
  age: z.coerce.number().min(18, 'Debes ser mayor de 18 años').max(100, 'Edad inválida').optional(), 
  master: z.array(z.string()).min(1, 'Debes seleccionar al menos una Máster adquirida'), 
  email: z.string().email('Ingresa un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  passwordConfirm: z.string().min(6, 'Debes confirmar la contraseña'),
})
.superRefine(({ password, passwordConfirm }, ctx) => {
  if (password !== passwordConfirm) {
    ctx.addIssue({
      code: "custom",
      message: "Las contraseñas no coinciden",
      path: ['passwordConfirm']
    });
  }
});

type RegisterFormData = z.infer<typeof schema>;

export default function Register() {
  const { register: registerUser } = useAuth() 
  const nav = useNavigate()
  
  // --- CAMBIO 3: Traemos los cursos de la base de datos ---
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  })

  // Transformamos los cursos al formato que necesita react-select { value, label }
  // Usamos el 'slug' como value para guardar en la DB, y 'title' como label para mostrar
  const dynamicOptions = courses?.map(course => ({
    value: course.slug, 
    label: course.title
  })) || []
  // --------------------------------------------------------

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema) as Resolver<RegisterFormData>,
    defaultValues: {
      name: '',
      lastname: '',
      telegram: '',
      age: undefined,
      master: [],
      email: '',
      password: '',
      passwordConfirm: '',
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (d) => {
    try { 
      await registerUser(d.name, d.lastname, d.age, d.telegram, d.master, d.email, d.password)
      toast.success('Registro exitoso. ¡Bienvenid@!')
      nav('/account') 
    }
    catch (e: any) { 
      toast.error(e?.response?.data?.message || 'Error al registrar el usuario. Intenta de nuevo.') 
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Crea tu cuenta!
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  <Input type="text" {...register('name')} placeholder="Tu nombre" />
                  {errors.name && (<p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>)}
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                  <Input type="text" {...register('lastname')} placeholder="Tu apellido" />
                  {errors.lastname && (<p className="mt-1.5 text-xs text-red-600">{errors.lastname.message}</p>)}
              </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
            <Input type="email" {...register('email')} placeholder="tu@email.com" />
            {errors.email && (<p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>)}
          </div>
          
          {/* Edad y Telegram */}
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario de Telegram (@)</label>
                <Input type="text" {...register('telegram')} placeholder="@usuario_telegram" />
                {errors.telegram && (<p className="mt-1.5 text-xs text-red-600">{errors.telegram.message}</p>)}
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                  <Input 
                      type="number" 
                      {...register('age', { valueAsNumber: true })} 
                      placeholder="25" 
                  />
                  {errors.age && (<p className="mt-1.5 text-xs text-red-600">{errors.age.message}</p>)}
              </div>
          </div>

          {/* Master Adquirida (Dinámico desde DB) */}
          <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                  ¿Qué **Máster** adquiriste?
              </label>
              
              <Controller
                  name="master" 
                  control={control}
                  render={({ field }) => (
                      <Select
                          {...field}
                          isMulti 
                          // --- CAMBIO 4: Usamos las opciones dinámicas y agregamos estado de carga ---
                          options={dynamicOptions} 
                          isLoading={isLoadingCourses}
                          loadingMessage={() => "Cargando cursos..."}
                          noOptionsMessage={() => "No se encontraron cursos activos"}
                          // --------------------------------------------------------------------------
                          
                          onChange={(selectedOptions) => {
                              field.onChange(selectedOptions.map(option => option.value));
                          }}
                          // Importante: filtrar sobre dynamicOptions para mostrar los seleccionados correctamente
                          value={dynamicOptions.filter(option => field.value?.includes(option.value))}
                          
                          classNamePrefix="react-select"
                          className={`mt-1 text-sm ${errors.master ? 'border border-red-500 rounded-md' : ''}`}
                          placeholder="Selecciona una o más..."
                      />
                  )}
              />
              
              {errors.master && (<p className="mt-1.5 text-xs text-red-600">{errors.master.message}</p>)}
          </div>
          
          {/* Contraseñas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <Input type="password" {...register('password')} placeholder="••••••••" />
            {errors.password && (<p className="mt-1.5 text-xs text-red-600">{errors.password.message}</p>)}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña</label>
            <Input type="password" {...register('passwordConfirm')} placeholder="••••••••" />
            {errors.passwordConfirm && (<p className="mt-1.5 text-xs text-red-600">{errors.passwordConfirm.message}</p>)}
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || isLoadingCourses} // Deshabilitar si se está enviando O cargando cursos
            className="w-full bg-blue-600 hover:bg-white-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 shadow-lg shadow-green-600/30 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Registrando...
              </span>
            ) : (
              'Crear cuenta'
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>

      <p className="text-center text-sm text-gray-600 mt-6">
        © 2025 Blue Team. Todos los derechos reservados.
      </p>
    </div>
  )
}