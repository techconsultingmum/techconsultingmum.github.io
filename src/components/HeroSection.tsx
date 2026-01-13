import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import ContactFormDialog from './ContactFormDialog';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-glow animate-pulse-glow" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                           linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Transformation</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Build Intelligent
            <br />
            <span className="text-gradient">Agentic AI Solutions</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Transform your business with autonomous AI agents that think, learn, and act. 
            We design and deploy cutting-edge agentic systems tailored to your unique challenges.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <ContactFormDialog formType="Schedule Consultation">
              <Button variant="hero" size="xl">
                Schedule Consultation
                <ArrowRight className="w-5 h-5" />
              </Button>
            </ContactFormDialog>
            <Button variant="heroOutline" size="xl">
              View Case Studies
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            {[
              { value: '150+', label: 'AI Agents Deployed' },
              { value: '98%', label: 'Client Satisfaction' },
              { value: '40%', label: 'Avg. Cost Reduction' },
              { value: '24/7', label: 'Autonomous Operation' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
