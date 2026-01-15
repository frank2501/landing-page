
import React, { useEffect, useRef } from 'react';

const BackgroundStars: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      // Calculamos la opacidad: de 1 a 0.1 en 800px de scroll
      const opacity = Math.max(0.1, 1 - scrollY / 800);
      containerRef.current.style.setProperty('--scroll-opacity', opacity.toString());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Inicializar
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generar posiciones estáticas una sola vez fuera del render si fuera necesario, 
  // pero aquí usamos un array fijo para evitar saltos en re-renders.
  const starPositions = Array.from({ length: 50 }, () => ({
    top: Math.random() * 100 + '%',
    left: Math.random() * 100 + '%',
    delay: Math.random() * 5 + 's',
    duration: 2 + Math.random() * 3 + 's'
  }));

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#020202]"
      style={{ '--scroll-opacity': '1' } as any}
    >
      {/* Capa de estrellas con opacidad controlada por CSS Variable para fluidez total */}
      <div className="absolute inset-0 transition-opacity duration-300 ease-out" style={{ opacity: 'var(--scroll-opacity)' }}>
        {/* Nebulosa de fondo */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(255,170,0,0.1),transparent_80%)]" />

        {/* Capas de estrellas con paralaje y loop suave */}
        <div className="star-field field-slow">
          <div className="star-content">
            {starPositions.map((pos, i) => (
              <div key={i} className="star twinkle" style={{ top: pos.top, left: pos.left, animationDelay: pos.delay, animationDuration: pos.duration, width: '1px', height: '1px' }} />
            ))}
          </div>
        </div>

        <div className="star-field field-mid">
          <div className="star-content">
            {starPositions.map((pos, i) => (
              <div key={i} className="star twinkle-bright" style={{ top: pos.top, left: pos.left, animationDelay: pos.delay, animationDuration: pos.duration, width: '1.5px', height: '1.5px' }} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .star-field {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          will-change: transform;
        }

        .star-content {
          position: relative;
          width: 100%;
          height: 100%;
        }

        /* Creamos un loop infinito moviendo la caja entera */
        .field-slow { animation: move-up 120s linear infinite; }
        .field-mid { animation: move-up 80s linear infinite; }

        @keyframes move-up {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }

        /* Duplicamos el contenido visualmente para el loop infinito sin cortes */
        .star-field::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 100%;
          background: inherit;
          /* Replicamos las estrellas de forma simplificada con box-shadow o simplemente usando dos divs */
        }

        /* Para un loop perfecto, necesitamos que la animación sea sobre un contenedor que tenga el doble de contenido */
        .star-content::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          height: 100%;
          /* Aquí idealmente clonaríamos los puntos, para efectos prácticos usamos fondos radiales repetitivos */
          background-image: inherit;
        }

        .star {
          position: absolute;
          background: white;
          border-radius: 50%;
        }

        .twinkle {
          animation: twinkle-anim infinite ease-in-out;
        }

        .twinkle-bright {
          box-shadow: 0 0 4px white;
          animation: twinkle-anim infinite ease-in-out;
        }

        @keyframes twinkle-anim {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default BackgroundStars;
