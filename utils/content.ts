import matter from "gray-matter";
import { marked } from "marked";

export interface ArticleFrontmatter {
  title: string;
  description: string;
  excerpt?: string;
  date: string;
  author: string;
  authorUrl?: string;
  category?: string;
  tags?: string[];
  image?: string;
  featured?: boolean;
  slug?: string;
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  content: string;
  html: string;
}

// Generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

// Parse markdown file
export const parseMarkdown = (content: string, slug: string): Article => {
  const { data, content: markdownContent } = matter(content);

  // Generate slug if not provided
  const articleSlug = (data.slug as string) || slug;

  const frontmatter: ArticleFrontmatter = {
    title: data.title || "",
    description: data.description || "",
    excerpt: data.excerpt || data.description || "",
    date: data.date || new Date().toISOString(),
    author: data.author || "ArtechIA",
    authorUrl: data.authorUrl,
    category: data.category,
    tags: Array.isArray(data.tags) ? data.tags : [],
    image: data.image || "/og-image.jpg",
    featured: data.featured || false,
    slug: articleSlug,
  };

  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const html = marked(markdownContent) as string;

  return {
    slug: articleSlug,
    frontmatter,
    content: markdownContent,
    html,
  };
};

// Extract headings from HTML for table of contents
export const extractHeadings = (
  html: string
): Array<{ id: string; text: string; level: number }> => {
  const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/gi;
  const headings: Array<{ id: string; text: string; level: number }> = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[2].replace(/<[^>]*>/g, ""); // Remove HTML tags
    const id = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    headings.push({ id, text, level });
  }

  return headings;
};

// Add IDs to headings in HTML
export const addHeadingIds = (html: string): string => {
  return html.replace(
    /<h([2-3])([^>]*)>(.*?)<\/h[2-3]>/gi,
    (match, level, attrs, text) => {
      const id = text
        .replace(/<[^>]*>/g, "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    }
  );
};
