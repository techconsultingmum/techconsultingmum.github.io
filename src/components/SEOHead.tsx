 import { Helmet } from 'react-helmet-async';
 
 interface SEOHeadProps {
   title?: string;
   description?: string;
   canonicalUrl?: string;
   ogImage?: string;
   ogType?: 'website' | 'article';
   article?: {
     publishedTime?: string;
     modifiedTime?: string;
     author?: string;
     section?: string;
   };
   noIndex?: boolean;
 }
 
const defaultMeta = {
   title: 'AgenticAI Lab — The First AI-Governed Consulting Firm',
   description:
      'The first AI-governed consulting firm — strategic, operational & financial decisions executed autonomously by an AI CEO under legal governance.',
   ogImage: '/og-image.png',
   siteUrl: 'https://agenticailab.in',
 };
 
 const SEOHead = ({
   title,
   description = defaultMeta.description,
   canonicalUrl,
   ogImage = defaultMeta.ogImage,
   ogType = 'website',
   article,
   noIndex = false,
 }: SEOHeadProps) => {
   const fullTitle = title
     ? `${title} | AgenticAI Lab`
     : defaultMeta.title;
 
   const fullOgImage = ogImage.startsWith('http')
     ? ogImage
     : `${defaultMeta.siteUrl}${ogImage}`;
 
   const canonical = canonicalUrl
     ? `${defaultMeta.siteUrl}${canonicalUrl}`
     : undefined;
 
    // Build JSON-LD for homepage
    const isHomePage = canonicalUrl === '/';
    const isContactPage = canonicalUrl === '/contact';

    return (
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        {noIndex && <meta name="robots" content="noindex, nofollow" />}
        {canonical && <link rel="canonical" href={canonical} />}
  
        {/* Open Graph Tags */}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={ogType} />
        <meta property="og:image" content={fullOgImage} />
        {canonical && <meta property="og:url" content={canonical} />}
        <meta property="og:site_name" content="AgenticAI Lab" />
  
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={fullOgImage} />
  
        {/* Article-specific meta (for blog posts) */}
        {ogType === 'article' && article?.publishedTime && (
          <meta property="article:published_time" content={article.publishedTime} />
        )}
        {ogType === 'article' && article?.modifiedTime && (
          <meta property="article:modified_time" content={article.modifiedTime} />
        )}
        {ogType === 'article' && article?.author && (
          <meta property="article:author" content={article.author} />
        )}
        {ogType === 'article' && article?.section && (
          <meta property="article:section" content={article.section} />
        )}

        {/* JSON-LD WebSite schema for homepage */}
        {isHomePage && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "AgenticAI Lab",
              "url": defaultMeta.siteUrl,
              "description": description,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${defaultMeta.siteUrl}/blog?q={search_term_string}`,
                "query-input": "required name=search_term_string"
              }
            })}
          </script>
        )}

        {/* Organization schema — homepage only */}
        {isHomePage && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AgenticAI Lab",
              "description": "The First AI-Governed Consulting Firm",
              "url": defaultMeta.siteUrl,
              "logo": `${defaultMeta.siteUrl}/og-image.png`,
              "contactPoint": {
                "@type": "ContactPoint",
                "email": "info@agenticailab.in",
                "telephone": "+91-8652074439",
                "contactType": "customer service"
              },
              "sameAs": [
                "https://www.linkedin.com/company/agenticai-lab/",
                "https://x.com/AgenticAILab",
                "https://github.com/techconsultingmum"
              ]
            })}
          </script>
        )}

        {/* LocalBusiness schema — contact page */}
        {(isContactPage || canonicalUrl === '/about') && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "AgenticAI Lab",
              "image": `${defaultMeta.siteUrl}/og-image.png`,
              "url": defaultMeta.siteUrl,
              "telephone": "+91-8652074439",
              "email": "info@agenticailab.in",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Mumbai",
                "addressRegion": "MH",
                "addressCountry": "IN"
              },
              "priceRange": "$$$"
            })}
          </script>
        )}

        {/* JSON-LD Article schema for blog posts */}
        {ogType === 'article' && article && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": title,
              "description": description,
              "image": fullOgImage,
              "author": {
                "@type": "Person",
                "name": article.author || "AgenticAI Lab"
              },
              "publisher": {
                "@type": "Organization",
                "name": "AgenticAI Lab",
                "logo": {
                  "@type": "ImageObject",
                  "url": `${defaultMeta.siteUrl}/og-image.png`
                }
              },
              ...(article.publishedTime && { "datePublished": article.publishedTime }),
              ...(article.modifiedTime && { "dateModified": article.modifiedTime })
            })}
          </script>
        )}
      </Helmet>
    );
 };
 
 export default SEOHead;