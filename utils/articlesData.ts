// Explicit article imports - this ensures Vite bundles them correctly
// @ts-ignore - Vite handles .md?raw imports
import automatizacionParaComercios from '../content/automatizacion-para-comercios.md?raw';
// @ts-ignore
import digitalizacionPymes from '../content/digitalizacion-pymes.md?raw';
// @ts-ignore
import sistemasAutomatizacionServicios from '../content/sistemas-automatizacion-servicios.md?raw';

import { parseMarkdown } from './content';
import { setArticles } from './articles';

// Map of article files
const articleFiles: Record<string, string> = {
  'automatizacion-para-comercios': automatizacionParaComercios,
  'digitalizacion-pymes': digitalizacionPymes,
  'sistemas-automatizacion-servicios': sistemasAutomatizacionServicios,
};

export const loadAllArticles = () => {
  try {
    
    const articles = Object.entries(articleFiles).map(([slug, content]) => {
      try {
        const article = parseMarkdown(content, slug);
        return article;
      } catch (error) {
        return null;
      }
    }).filter((article): article is NonNullable<typeof article> => article !== null);
    
    setArticles(articles);
    return articles;
  } catch (error) {
    setArticles([]);
    return [];
  }
};
