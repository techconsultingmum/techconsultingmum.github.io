 import Header from '@/components/Header';
 import SEOHead from '@/components/SEOHead';
import HeroSection from '@/components/HeroSection';
import ServicesSection from '@/components/ServicesSection';
import ProcessSection from '@/components/ProcessSection';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import SkipToContent from '@/components/SkipToContent';

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
        <ServicesSection />
        <ProcessSection />
        <AboutSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
