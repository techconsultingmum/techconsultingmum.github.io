import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-glow opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Ready to Build Your
            <br />
            <span className="text-gradient">Intelligent Workforce?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Let's discuss how autonomous AI agents can transform your operations. 
            Book a free consultation with our experts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              <Calendar className="w-5 h-5" />
              Book Free Consultation
            </Button>
            <Button variant="heroOutline" size="xl">
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            No commitment required • Response within 24 hours
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
