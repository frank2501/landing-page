import React, { useEffect } from 'react';
import { generateSitemap } from '../utils/sitemap';

const SitemapXml: React.FC = () => {
  useEffect(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const staticPages = ['/', '/blog'];
    const xml = generateSitemap(baseUrl, staticPages);
    
    // Create blob and download or set as response
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // For server-side rendering, you'd return this as XML
    // For client-side, we'll just log it (in production, this should be server-side)
    console.log('Sitemap XML:', xml);
  }, []);

  return null;
};

export default SitemapXml;


