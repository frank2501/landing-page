import React from 'react';
import { Link } from 'react-router-dom';
import StructuredData, { generateBreadcrumbSchema } from './SEO/StructuredData';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const breadcrumbSchema = generateBreadcrumbSchema(items);

  return (
    <>
      <StructuredData data={breadcrumbSchema} />
      <nav className="flex items-center gap-2 text-sm md:text-base text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none" aria-label="Breadcrumb">
        {items.map((item, index) => (
          <React.Fragment key={item.url}>
            {index > 0 && (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
            <div className="shrink-0">
              {index === items.length - 1 ? (
                <span className="text-white">{item.name}</span>
              ) : (
                <Link to={item.url} className="hover:text-orange-400 transition-colors">
                  {item.name}
                </Link>
              )}
            </div>
          </React.Fragment>
        ))}
      </nav>
    </>
  );
};

export default Breadcrumb;
