import { parseMarkdown } from './content';
import { setArticles } from './articles';

// Use Vite's import.meta.glob to load all markdown files from the content folder automatically
// { query: '?raw', eager: true } ensures we get the raw content of the files at build time
const articleModules = import.meta.glob('../content/*.md', { query: '?raw', eager: true });

export const loadAllArticles = () => {
  try {
    const articles = Object.entries(articleModules).map(([path, module]) => {
      try {
        // Extract slug from filename (e.g., '../content/slug.md' -> 'slug')
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        const content = (module as any).default;
        
        if (typeof content !== 'string') {
          return null;
        }

        return parseMarkdown(content, slug);
      } catch (error) {
        console.error(`Error loading article at ${path}:`, error);
        return null;
      }
    }).filter((article): article is NonNullable<typeof article> => article !== null);
    
    // Sort articles by date descending
    articles.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
    
    setArticles(articles);
    return articles;
  } catch (error) {
    console.error('Error in loadAllArticles:', error);
    setArticles([]);
    return [];
  }
};

