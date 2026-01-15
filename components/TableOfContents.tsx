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
    const handleScroll = () => {
      const headingElements = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
      
      if (headingElements.length === 0) return;

      let current = '';
      for (const element of headingElements) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= 100) {
          current = element.id;
        } else {
          break;
        }
      }
      
      setActiveId(current || headings[0]?.id || '');
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
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

  return (
    <div className="sticky top-24 hidden lg:block">
      <div className="premium-border rounded-2xl p-6 bg-zinc-900/50 backdrop-blur-sm">
        <h3 className="text-lg font-bold mb-4 text-white">Contenido</h3>
        <nav className="space-y-2">
          {headings.map((heading) => (
            <button
              key={heading.id}
              onClick={() => scrollToHeading(heading.id)}
              className={`block w-full text-left transition-colors ${
                heading.level === 3 ? 'pl-4 text-sm' : 'text-base'
              } ${
                activeId === heading.id
                  ? 'text-orange-400 font-medium'
                  : 'text-gray-400 hover:text-white'
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
