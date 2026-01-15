import React, { useEffect, useState } from 'react';
import { generateSitemap } from '../utils/sitemap';

const SitemapPage: React.FC = () => {
  const [sitemapXml, setSitemapXml] = useState<string>('');

  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const staticPages = ['/', '/blog'];
    const xml = generateSitemap(baseUrl, staticPages);
    setSitemapXml(xml);
  }, []);

  useEffect(() => {
    if (sitemapXml) {
      // Set content type and return XML
      const headers = new Headers();
      headers.set('Content-Type', 'application/xml');
      
      // In a real app, this would be handled server-side
      // For now, we'll just display it
    }
  }, [sitemapXml]);

  return (
    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
      {sitemapXml || 'Generating sitemap...'}
    </pre>
  );
};

export default SitemapPage;
