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
         description="Transform your business with autonomous AI agents that think, learn, and act. AgenticAI Lab designs and deploys cutting-edge agentic systems tailored to your unique challenges."
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
