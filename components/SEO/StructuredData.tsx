import React from 'react';

interface StructuredDataProps {
  data: object;
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

// Helper functions to generate common schemas
export const generateOrganizationSchema = (siteName: string, siteUrl: string, logo?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  ...(logo && { logo: logo.startsWith('http') ? logo : `${siteUrl}${logo}` }),
});

export const generateWebSiteSchema = (siteName: string, siteUrl: string, searchAction?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
  ...(searchAction && {
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchAction,
      },
      'query-input': 'required name=search_term_string',
    },
  }),
});

export const generateArticleSchema = (
  title: string,
  description: string,
  image: string,
  url: string,
  author: { name: string; url?: string },
  publishedDate: string,
  modifiedDate?: string,
  siteName: string
) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: title,
  description,
  image: image.startsWith('http') ? image : `${url.split('/').slice(0, 3).join('/')}${image}`,
  datePublished: publishedDate,
  dateModified: modifiedDate || publishedDate,
  author: {
    '@type': 'Person',
    name: author.name,
    ...(author.url && { url: author.url }),
  },
  publisher: {
    '@type': 'Organization',
    name: siteName,
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': url,
  },
});

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export default StructuredData;
