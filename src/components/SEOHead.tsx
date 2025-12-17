import { useEffect } from 'react';
import { useWebsite } from '../context/WebsiteContext';


const SEOHead = () => {
  const { websiteData, getInfoValue } = useWebsite();

  useEffect(() => {
    // Get values from props or fallback to website data
    const seoTitle = getInfoValue('META_TITLE');
    const seoDescription = getInfoValue('META_DESCRIPTION');
    const seoKeywords = getInfoValue('META_KEYWORDS');
    const seoAuthor = getInfoValue('META_AUTHOR');
    const siteTitle = getInfoValue('TITLE');
    const domain = websiteData?.domain;

    // Update document title
    document.title = seoTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = name;
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const updatePropertyTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Update basic meta tags
    updateMetaTag('description', seoDescription);
    updateMetaTag('keywords', seoKeywords);
    updateMetaTag('author', seoAuthor);

    // Update Open Graph tags
    updatePropertyTag('og:title', seoTitle);
    updatePropertyTag('og:description', seoDescription);
    updatePropertyTag('og:url', domain || '');
    updatePropertyTag('og:site_name', siteTitle);

    // Update Twitter Card tags
    updatePropertyTag('twitter:title', seoTitle);
    updatePropertyTag('twitter:description', seoDescription);
 

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = domain || '';

  }, [websiteData, getInfoValue]);

  return null; // This component doesn't render anything
};

export default SEOHead;





