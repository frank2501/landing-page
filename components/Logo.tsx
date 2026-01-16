import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 1 | 2 | 3;
  showText?: boolean;
  text?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "w-8 h-8", 
  variant = 1, 
  showText = true,
  text = "Artech"
}) => {
  
  // Opción 1: "Split Diamond" (Corte Central)
  // Dos triángulos isósceles que forman un rombo perfecto partido por la mitad.
  // Sensación: Equilibrio y Dualidad.
  const LogoVariant1 = () => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Triángulo Izquierdo (Blanco) */}
      <path d="M4 20L20 4V36L4 20Z" className="fill-white" />
      {/* Triángulo Derecho (Naranja) - Ligeramente separado */}
      <path d="M36 20L20 36V4L36 20Z" className="fill-orange-500" />
    </svg>
  );

  // Opción 2: "Diagonal Kinetic" (Movimiento Diagonal - RECOMENDADA)
  // Dos triángulos enfrentados en diagonal. No se tocan.
  // Forman la silueta de un rombo pero con tensión dinámica.
  const LogoVariant2 = () => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Triángulo Inferior Izquierdo (Blanco) */}
      <path d="M8 20L20 36H6L8 20Z" className="fill-white" />
      {/* Triángulo Superior Derecho (Naranja) */}
      <path d="M32 20L20 4H34L32 20Z" className="fill-orange-500" />
    </svg>
  );

  // Opción 3: "Sharp Shards" (Agresivo/Tech)
  // Dos triángulos rectángulos delgados que cortan el espacio.
  // Es la opción más futurista.
  const LogoVariant3 = () => (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Triángulo Blanco (Abajo) */}
      <path d="M10 34L28 34L12 18V34Z" className="fill-white" />
      {/* Triángulo Naranja (Arriba) */}
      <path d="M28 6L12 6L28 22V6Z" className="fill-orange-500" />
    </svg>
  );

  return (
    <div className="flex items-center gap-3 select-none group">
      {/* Icono (Sin rotación para mantener la diagonal firme) */}
      <div className="transition-transform duration-300 group-hover:scale-110">
        {variant === 1 && <LogoVariant1 />}
        {variant === 2 && <LogoVariant2 />}
        {variant === 3 && <LogoVariant3 />}
      </div>
      
      {showText && (
        <div className="relative flex items-baseline">
          {/* Nombre Base */}
          <span className="font-bold text-xl md:text-2xl tracking-tight text-white">
            {text}
          </span>
          
          {/* El "IA" como exponente (Estilo Opción 1 anterior) */}
          <sup className="text-[10px] md:text-xs font-bold text-orange-500 tracking-widest ml-0.5 -top-2">
            IA
          </sup>
        </div>
      )}
    </div>
  );
};

export default Logo;