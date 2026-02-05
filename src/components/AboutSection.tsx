import { CheckCircle2 } from 'lucide-react';
 import { motion } from 'framer-motion';
 import AnimatedSection from './AnimatedSection';

const features = [
  'Deep expertise in LLMs, RAG, and agent frameworks',
  'Battle-tested architectures for enterprise scale',
  'Transparent pricing with measurable ROI',
  'Dedicated support and continuous optimization',
  'Security-first approach with compliance focus',
  'Rapid prototyping and iterative delivery',
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Content */}
           <AnimatedSection animation="slideLeft">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
              Trusted by Industry Leaders in AI Innovation
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              We're not just consultants—we're builders. Our team combines deep research expertise 
              with hands-on engineering to deliver AI agents that actually work in production.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>
           </AnimatedSection>

          {/* Right: Visual */}
           <AnimatedSection animation="slideRight" delay={0.2} className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-card to-card border border-border/50 p-8 flex items-center justify-center">
              {/* Abstract AI visualization */}
              <div className="relative w-full h-full">
                {/* Central node */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-primary/30 border border-primary shadow-glow flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary animate-pulse" />
                </div>

                {/* Orbiting nodes */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const angle = (i * 60) * (Math.PI / 180);
                  const radius = 120;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;
                  
                  return (
                    <div
                      key={i}
                      className="absolute w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center"
                      style={{
                        top: `calc(50% + ${y}px)`,
                        left: `calc(50% + ${x}px)`,
                        transform: 'translate(-50%, -50%)',
                        animationDelay: `${i * 0.2}s`,
                      }}
                    >
                      <div className="w-4 h-4 rounded-full bg-primary/50" />
                    </div>
                  );
                })}

                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const angle = (i * 60) * (Math.PI / 180);
                    const radius = 120;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    
                    return (
                      <line
                        key={i}
                        x1="50%"
                        y1="50%"
                        x2={`calc(50% + ${x}px)`}
                        y2={`calc(50% + ${y}px)`}
                        stroke="hsl(var(--primary) / 0.2)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
           </AnimatedSection>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
