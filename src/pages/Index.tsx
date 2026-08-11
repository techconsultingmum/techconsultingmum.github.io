import { lazy, Suspense } from 'react';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import HeroSection from '@/components/HeroSection';
import Footer from '@/components/Footer';
import SkipToContent from '@/components/SkipToContent';

// Below-the-fold sections load after the hero paints (better LCP).
const ServicesSection = lazy(() => import('@/components/ServicesSection'));
const ProcessSection = lazy(() => import('@/components/ProcessSection'));
const AboutSection = lazy(() => import('@/components/AboutSection'));
const TestimonialsSection = lazy(() => import('@/components/TestimonialsSection'));
const CTASection = lazy(() => import('@/components/CTASection'));

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
       <SEOHead 
         canonicalUrl="/"
          description="Build intelligent agentic AI solutions for enterprise transformation with autonomous agents, AI integration, and governed consulting systems."
       />
       <SkipToContent />
      <Header />
      <main id="main-content">
        <HeroSection />
        <Suspense fallback={<div className="min-h-[40vh]" aria-hidden="true" />}>
          <ServicesSection />
          <ProcessSection />
          <AboutSection />
          <TestimonialsSection />
          <CTASection />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
