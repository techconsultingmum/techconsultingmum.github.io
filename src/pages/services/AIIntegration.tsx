import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkipToContent from '@/components/SkipToContent';
import { Button } from '@/components/ui/button';
import { Cog, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  'Enterprise system integration',
  'API development and management',
  'Cloud-native deployment',
  'Security and compliance frameworks',
  'Performance optimization',
  'Monitoring and observability',
];

const useCases = [
  {
    title: 'CRM Enhancement',
    description: 'Integrate AI capabilities directly into your existing CRM for intelligent customer insights.',
  },
  {
    title: 'ERP Automation',
    description: 'Connect AI agents to your ERP system for automated workflows and decision support.',
  },
  {
    title: 'Legacy Modernization',
    description: 'Bridge AI capabilities with legacy systems through secure, reliable integrations.',
  },
];

const AIIntegration = () => {
  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <Cog className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                AI Integration & Deployment
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Seamlessly integrate agentic AI into your existing infrastructure with enterprise-grade security and scalability.
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link to="/get-started">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
                What We Deliver
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border/50">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-4">
                Use Cases
              </h2>
              <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                See how our integrations bring AI to your existing systems.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {useCases.map((useCase) => (
                  <div key={useCase.title} className="p-6 rounded-2xl bg-glass border border-border/50 hover:border-primary/30 transition-all duration-300">
                    <h3 className="font-display text-xl font-semibold mb-3">{useCase.title}</h3>
                    <p className="text-muted-foreground">{useCase.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Ready to Integrate AI?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Let's connect AI capabilities to your existing infrastructure.
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AIIntegration;
