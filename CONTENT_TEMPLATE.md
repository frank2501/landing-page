# Plantilla para Artículos

Usa esta plantilla cuando crees nuevos artículos en la carpeta `/content`.

## Estructura del archivo

Crea un archivo `.md` en la carpeta `/content` con el siguiente formato:

```markdown
---
title: "Título del Artículo"
description: "Descripción breve para SEO (150-160 caracteres)"
excerpt: "Resumen más largo que aparecerá en las tarjetas de artículos"
date: "2025-01-15"
author: "Teddy Automations"
authorUrl: "https://teddyautomations.com" # Opcional
category: "Categoría"
tags: ["tag1", "tag2", "tag3"]
image: "/og-image.jpg" # URL de la imagen destacada
featured: true # true para artículos destacados
slug: "custom-slug" # Opcional, se genera automáticamente del título
---

# Título del Artículo

Contenido del artículo en Markdown...

## Subtítulo H2

### Subtítulo H3

Párrafos de texto...

- Listas
- Con viñetas

1. Listas
2. Numeradas

**Texto en negrita** y *texto en cursiva*.

[Enlaces](https://ejemplo.com)

> Citas o blockquotes

`Código inline` y bloques de código:

\`\`\`javascript
// Código aquí
\`\`\`
```

## Campos del Frontmatter

### Requeridos
- `title`: Título del artículo
- `description`: Meta descripción para SEO
- `date`: Fecha en formato ISO (YYYY-MM-DD)
- `author`: Nombre del autor

### Opcionales
- `excerpt`: Resumen extendido (si no se proporciona, usa description)
- `authorUrl`: URL del perfil del autor
- `category`: Categoría del artículo
- `tags`: Array de etiquetas
- `image`: URL de la imagen destacada (default: /og-image.jpg)
- `featured`: Boolean para artículos destacados
- `slug`: Slug personalizado (se genera automáticamente si no se proporciona)

## Ejemplo completo

```markdown
---
title: "Cómo Automatizar tu Negocio en 5 Pasos"
description: "Guía paso a paso para automatizar procesos y ahorrar tiempo en tu negocio."
excerpt: "Descubre cómo implementar automatización en tu negocio siguiendo estos 5 pasos simples pero efectivos."
date: "2025-01-20"
author: "Teddy Automations"
category: "Automatización"
tags: ["automatización", "productividad", "negocios"]
image: "/images/automatizacion.jpg"
featured: true
---

# Cómo Automatizar tu Negocio en 5 Pasos

Introducción del artículo...

## Paso 1: Identifica procesos repetitivos

Contenido...

## Paso 2: Evalúa herramientas

Contenido...

## Conclusión

Resumen final...
```

## Notas importantes

1. El slug se genera automáticamente del título si no se especifica
2. Las imágenes deben estar en la carpeta `public` o ser URLs externas
3. Usa encabezados H2 y H3 para crear la tabla de contenidos automática
4. El formato de fecha debe ser ISO (YYYY-MM-DD)
5. Los tags y categorías se usan para filtrado y artículos relacionados
