import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ 
  className = "w-12 h-12", 
  showText = true,
  onClick
}) => {

  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-2 select-none group cursor-pointer w-fit p-1 rounded-xl hover:bg-white/5 transition-colors duration-300 ${onClick ? 'cursor-pointer' : ''}`}
    >
      
      {/* ISOTIPO (El Gráfico) */}
      <div className="relative flex items-center justify-center p-1">
        
        {/* Glow naranja detrás */}
        <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-75" />

        <svg 
          className={`${className} overflow-visible`} 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 
             GRUPO DE ROTACIÓN
             Aplicamos la inclinación de 45 grados a toda la figura alargada.
          */}
          <g className="origin-center rotate-45">
            
            {/* 
               DEFINICIÓN DE LA FORMA (PRE-ROTACIÓN):
               Hacemos un rombo "flaco" (Alto 38, Ancho 16).
               Al rotarlo, se verá como una lanza diagonal.
            */}

            {/* Triángulo Superior (Blanco) */}
            {/* Punta en Y=1, Base en Y=19. Ancho X=12 a X=28 (8px de cada lado del centro) */}
            <path 
              d="M20 1 L28 19 H12 L20 1 Z" 
              className="fill-white transition-transform duration-500 ease-out group-hover:-translate-y-1" 
            />
            
            {/* Triángulo Inferior (Naranja-500) */}
            {/* Punta en Y=39, Base en Y=21. */}
            <path 
              d="M20 39 L28 21 H12 L20 39 Z" 
              className="fill-orange-500 transition-transform duration-500 ease-out group-hover:translate-y-1" 
            />
            
            {/* 
               GAP (Corte):
               Entre Y=19 y Y=21 hay 2 unidades de separación.
               Al rotarse 45º, el corte queda diagonal perpendicular.
            */}
          </g>
        </svg>
      </div>
      
      {/* LOGOTIPO (El Texto) */}
      {showText && (
        <div className="flex items-start select-none">
          {/* Nombre Base */}
          <span className="font-sans font-bold text-2xl text-white tracking-tight leading-none">
            Artech
          </span>
          
          {/* IA chiquito arriba a la derecha */}
          <span className="font-sans font-bold text-[10px] text-orange-500 ml-0.5 -mt-0.5 leading-none">
            IA
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;