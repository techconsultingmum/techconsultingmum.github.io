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
         description="AgenticAI Lab is the first AI-governed consulting firm where strategic, operational, and financial decisions are autonomously executed by an AI CEO system — under legal governance."
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
