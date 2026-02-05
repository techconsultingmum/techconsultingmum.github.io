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
   title: 'AgenticAI Lab - Build Intelligent Agentic AI Solutions',
   description:
     'Transform your business with autonomous AI agents that think, learn, and act. We design and deploy cutting-edge agentic systems tailored to your unique challenges.',
   ogImage: '/og-image.png',
   siteUrl: 'https://agenticailab.com',
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
     </Helmet>
   );
 };
 
 export default SEOHead;