// Content loader utility for Vite
// This will be used to load markdown files at build/runtime

export const loadMarkdownFiles = async (): Promise<Record<string, string>> => {
  // In Vite, we can use import.meta.glob to load markdown files
  const modules = import.meta.glob('../content/**/*.md', { as: 'raw', eager: true });
  
  const articles: Record<string, string> = {};
  
  for (const path in modules) {
    const content = modules[path] as string;
    const key = path.replace('../content/', '').replace('.md', '');
    articles[key] = content;
  }
  
  return articles;
};
