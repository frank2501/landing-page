import React, { useState, useEffect } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ headings }) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -70% 0px', // Detect when heading is in the top portion
      threshold: 0,
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Initial check for all headings
    headings.forEach((h) => {
      const element = document.getElementById(h.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const activeIndex = headings.findIndex(h => h.id === activeId);

  return (
    <div className="premium-border rounded-2xl p-6 bg-zinc-900/40 backdrop-blur-md shadow-2xl border-white/5 overflow-hidden">
        <h3 className="text-[10px] font-bold mb-6 text-gray-500 uppercase tracking-[0.2em]">Contenido</h3>
        
        <div className="relative">
          {/* Vertical Track */}
          <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-white/5" />
          
          {/* Sliding Background Block */}
          {activeIndex !== -1 && (
            <div 
              className="absolute left-0 right-[-1.5rem] bg-orange-500/10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{ 
                height: '32px', 
                top: `${activeIndex * 32}px`,
                opacity: activeId ? 1 : 0
              }}
            />
          )}
          
          {/* Sliding Indicator Line */}
          {activeIndex !== -1 && (
            <div 
              className="absolute left-0 w-[2px] bg-orange-500 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_0_12px_rgba(249,115,22,0.8)]"
              style={{ 
                height: '32px', 
                top: `${activeIndex * 32}px`,
                opacity: activeId ? 1 : 0
              }}
            />
          )}

          <nav className="relative z-10 space-y-0 flex flex-col">
            {headings.map((heading) => (
              <button
                key={heading.id}
                onClick={() => scrollToHeading(heading.id)}
                className={`flex items-center h-8 w-full text-left transition-all duration-500 pl-6 ${
                  heading.level === 3 ? 'text-xs italic' : 'text-sm font-medium'
                } ${
                  activeId === heading.id
                    ? 'text-orange-400 translate-x-1'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {heading.text}
              </button>
            ))}
          </nav>
        </div>
      </div>
  );
};

export default TableOfContents;
