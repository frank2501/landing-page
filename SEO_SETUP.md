# SEO Infrastructure Setup - Guía Completa

Este documento describe la infraestructura SEO completa implementada en el sitio.

## 📋 Resumen de Implementación

### ✅ Componentes SEO Creados

1. **MetaTags Component** (`components/SEO/MetaTags.tsx`)
   - Actualiza dinámicamente title, description, Open Graph, Twitter Cards
   - Soporte para canonical URLs
   - Meta tags para artículos (author, published time, etc.)

2. **StructuredData Component** (`components/SEO/StructuredData.tsx`)
   - Genera JSON-LD structured data
   - Helpers para: Organization, WebSite, Article, BreadcrumbList, FAQPage

3. **Breadcrumb Component** (`components/Breadcrumb.tsx`)
   - Navegación breadcrumb con structured data
   - Integrado con React Router

4. **TableOfContents Component** (`components/TableOfContents.tsx`)
   - Tabla de contenidos auto-generada desde headings
   - Scroll spy para destacar sección activa
   - Sticky sidebar en desktop

### ✅ Páginas Creadas

1. **HomePage** (`pages/HomePage.tsx`)
   - Structured data: Organization, WebSite
   - Meta tags optimizados
   - Sección "Latest Articles"

2. **BlogPage** (`pages/BlogPage.tsx`)
   - Listado de artículos con filtros
   - Paginación
   - Filtrado por categoría y tags
   - SEO optimizado para /blog

3. **ArticlePage** (`pages/ArticlePage.tsx`)
   - Template completo de artículo
   - Structured data: Article schema
   - Breadcrumbs
   - Table of contents
   - Related articles
   - Meta tags completos (OG, Twitter)

4. **NotFoundPage** (`pages/NotFoundPage.tsx`)
   - Página 404 personalizada
   - Meta tags apropiados

### ✅ Sistema de Contenido

1. **Content Management** (`utils/content.ts`)
   - Parser de Markdown con frontmatter
   - Generación automática de slugs
   - Extracción de headings para TOC
   - Agregación de IDs a headings

2. **Articles Utilities** (`utils/articles.ts`)
   - Gestión de artículos en memoria
   - Funciones: getAllArticles, getArticleBySlug, getRelatedArticles
   - Filtrado por categoría y tags
   - Ordenamiento por fecha

3. **Content Folder** (`/content`)
   - Artículos en formato Markdown
   - Frontmatter con metadata completa
   - 3 artículos de ejemplo incluidos

### ✅ SEO Técnico

1. **Sitemap** (`utils/sitemap.ts`, `scripts/generate-sitemap.js`)
   - Generación automática de sitemap.xml
   - Incluye páginas estáticas y artículos
   - Lastmod dates
   - Priorities y changefreq
   - Script de build: `npm run generate-sitemap`

2. **Robots.txt** (`public/robots.txt`)
   - Permite todos los crawlers
   - Bloquea rutas admin/api
   - Apunta al sitemap

3. **Structured Data Implementado**
   - ✅ Organization (homepage)
   - ✅ WebSite (homepage)
   - ✅ Article (páginas de artículo)
   - ✅ BreadcrumbList (navegación)
   - ✅ FAQPage (componente FAQ)

### ✅ Internal Linking

1. **Breadcrumbs** en todas las páginas de artículo
2. **Latest Articles** en homepage (6 artículos recientes)
3. **Footer links** a Inicio y Blog
4. **Related Articles** al final de cada artículo
5. **Category/Tag filtering** en blog index

## 🚀 Uso

### Agregar Nuevos Artículos

1. Crea un archivo `.md` en `/content`
2. Usa la plantilla en `CONTENT_TEMPLATE.md`
3. El artículo aparecerá automáticamente en `/blog`
4. El slug se genera del nombre del archivo o del frontmatter

Ejemplo:
```markdown
---
title: "Mi Nuevo Artículo"
description: "Descripción para SEO"
date: "2025-01-20"
author: "ArtechIA"
category: "Automatización"
tags: ["tag1", "tag2"]
featured: true
---

# Contenido del artículo...
```

### Generar Sitemap

El sitemap se genera automáticamente durante el build:
```bash
npm run build
```

O manualmente:
```bash
npm run generate-sitemap
```

Asegúrate de configurar `SITE_URL` en tu `.env`:
```
SITE_URL=https://tudominio.com
```

### Rutas Disponibles

- `/` - Homepage
- `/blog` - Índice de artículos
- `/blog/[slug]` - Artículo individual
- `/404` - Página no encontrada

## 📊 SEO Checklist

### ✅ Implementado

- [x] Meta tags dinámicos (title, description)
- [x] Open Graph tags
- [x] Twitter Card tags
- [x] Canonical URLs
- [x] Structured data (JSON-LD)
- [x] Sitemap.xml
- [x] Robots.txt
- [x] Semantic HTML (article, header, main, footer)
- [x] Heading hierarchy (H1, H2, H3)
- [x] Internal linking
- [x] Breadcrumbs
- [x] Table of contents
- [x] Related articles
- [x] Responsive design
- [x] Fast loading

### 🔄 Para Configurar

1. **Actualizar robots.txt** con tu dominio real
2. **Configurar SITE_URL** en variables de entorno
3. **Agregar og-image.jpg** en `/public`
4. **Configurar analytics** (Google Analytics, etc.)
5. **Verificar en Google Search Console**

## 🎨 Diseño

Todos los componentes mantienen el diseño existente:
- Dark theme (black background, white text)
- Orange accents (#fb923c)
- Fonts: Inter (sans-serif), Playfair Display (serif)
- Responsive design
- Premium borders y glows

## 📝 Notas Técnicas

### Routing
- Usa React Router v7
- BrowserRouter para SPA
- Rutas dinámicas para artículos

### Content Loading
- Usa Vite's `import.meta.glob` para cargar markdown
- Parsing con `gray-matter` y `marked`
- Carga en runtime (no requiere build step)

### SEO en SPA
- MetaTags actualiza el `<head>` dinámicamente
- Structured data inyectado como JSON-LD
- Canonical URLs para evitar contenido duplicado

## 🔗 Recursos

- [Google Structured Data Testing Tool](https://search.google.com/test/rich-results)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Schema.org](https://schema.org/)

## 📞 Soporte

Para preguntas o problemas con la implementación SEO, consulta la documentación o contacta al equipo de desarrollo.
