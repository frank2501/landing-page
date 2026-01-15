import { Article, ArticleFrontmatter } from './content';

// This will be populated at build time or runtime
// For now, we'll use a simple in-memory store that can be replaced with file system reading
let articlesCache: Article[] = [];

export const setArticles = (articles: Article[]) => {
  articlesCache = articles;
};

export const getAllArticles = (): Article[] => {
  return articlesCache.sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return dateB - dateA; // Newest first
  });
};

export const getArticleBySlug = (slug: string): Article | undefined => {
  return articlesCache.find((article) => article.slug === slug);
};

export const getFeaturedArticles = (limit: number = 3): Article[] => {
  return getAllArticles()
    .filter((article) => article.frontmatter.featured)
    .slice(0, limit);
};

export const getRecentArticles = (limit: number = 6): Article[] => {
  return getAllArticles().slice(0, limit);
};

export const getArticlesByCategory = (category: string): Article[] => {
  return getAllArticles().filter(
    (article) => article.frontmatter.category?.toLowerCase() === category.toLowerCase()
  );
};

export const getArticlesByTag = (tag: string): Article[] => {
  return getAllArticles().filter(
    (article) =>
      article.frontmatter.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
  );
};

export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  articlesCache.forEach((article) => {
    if (article.frontmatter.category) {
      categories.add(article.frontmatter.category);
    }
  });
  return Array.from(categories).sort();
};

export const getAllTags = (): string[] => {
  const tags = new Set<string>();
  articlesCache.forEach((article) => {
    article.frontmatter.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
};

export const getRelatedArticles = (
  currentArticle: Article,
  limit: number = 3
): Article[] => {
  const { category, tags } = currentArticle.frontmatter;
  const related: Article[] = [];

  // Find articles with same category
  if (category) {
    const sameCategory = getArticlesByCategory(category).filter(
      (article) => article.slug !== currentArticle.slug
    );
    related.push(...sameCategory);
  }

  // Find articles with same tags
  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      const sameTag = getArticlesByTag(tag).filter(
        (article) =>
          article.slug !== currentArticle.slug &&
          !related.some((r) => r.slug === article.slug)
      );
      related.push(...sameTag);
    });
  }

  // If not enough related articles, add recent ones
  if (related.length < limit) {
    const recent = getRecentArticles(limit + 1).filter(
      (article) =>
        article.slug !== currentArticle.slug &&
        !related.some((r) => r.slug === article.slug)
    );
    related.push(...recent.slice(0, limit - related.length));
  }

  return related.slice(0, limit);
};
