// En ../components/Card.tsx (Tu archivo)

import React from 'react' // Asegúrate de importar React

// 1. Define las props extendiendo los atributos de un div
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // children ya viene incluido en React.HTMLAttributes, 
  // pero si quieres ser explícito, puedes dejarlo.
  // No necesitas props personalizadas por ahora.
}

// 2. Usa la nueva interfaz y desestructura 'className' y '...rest'
export default function Card({ children, className, ...rest }: CardProps) {
  
  // 3. Combina tus clases base con las que vienen de 'className'
  const baseClasses = "rounded-xl border p-4 shadow-sm bg-white"
  const combinedClasses = `${baseClasses} ${className || ''}`

  return (
    // 4. Aplica las clases combinadas y el '...rest'
    <div className={combinedClasses} {...rest}>
      {children}
    </div>
  )
}