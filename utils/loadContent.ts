import { parseMarkdown } from './content';
import { setArticles } from './articles';

// Load markdown files using import.meta.glob
// Try multiple path patterns to find the correct one
function getMarkdownModules(): Record<string, string> {
  // Try different path patterns
  const patterns = [
    '../content/**/*.md',  // Relative to utils folder
    './content/**/*.md',   // Relative to project root
    '/content/**/*.md',    // Absolute from project root
  ];

  for (const pattern of patterns) {
    try {
      const modules = import.meta.glob(pattern, { as: 'raw', eager: true }) as Record<string, string>;
      if (Object.keys(modules).length > 0) {
        console.log(`✅ Found files with pattern: ${pattern}`);
        return modules;
      }
    } catch (error) {
      // Continue to next pattern
    }
  }

  // Last resort: try the most common pattern
  try {
    return import.meta.glob('../content/**/*.md', { as: 'raw', eager: true }) as Record<string, string>;
  } catch {
    return {};
  }
}

const markdownModules = getMarkdownModules();

export const loadAllArticles = () => {
  try {
    console.log('🔍 Attempting to load articles...');
    console.log('📁 Found modules:', Object.keys(markdownModules));
    
    if (Object.keys(markdownModules).length === 0) {
      console.error('❌ No markdown files found! Check that files exist in /content folder');
      console.log('💡 Make sure files are in: content/*.md');
      setArticles([]);
      return [];
    }
    
    return processModules(markdownModules);
  } catch (error) {
    console.error('❌ Error loading articles:', error);
    setArticles([]);
    return [];
  }
};

function processModules(modules: Record<string, string>) {
  const articles = Object.entries(modules).map(([path, content]) => {
    // Extract slug from path
    // Paths can be: /content/article.md or ./content/article.md or ../content/article.md
    let slug = path
      .replace(/^.*\/content\//, '') // Remove everything up to /content/
      .replace(/\.md$/, '') // Remove .md extension
      .split('/')
      .pop() || '';
    
    slug = slug.trim();
    
    if (!content || typeof content !== 'string') {
      console.warn(`⚠️ Invalid content for ${path}`);
      return null;
    }
    
    if (!slug) {
      console.warn(`⚠️ Could not extract slug from path: ${path}`);
      return null;
    }
    
    try {
      const article = parseMarkdown(content, slug);
      return article;
    } catch (error) {
      console.error(`❌ Error parsing article ${slug}:`, error);
      return null;
    }
  }).filter((article): article is NonNullable<typeof article> => article !== null);
  
  console.log(`✅ Loaded ${articles.length} articles:`);
  articles.forEach(a => {
    console.log(`   ✓ "${a.frontmatter.title}" → /blog/${a.slug}`);
  });
  
  setArticles(articles);
  return articles;
}
