import { Search, Lightbulb, Code2, Rocket } from 'lucide-react';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Discovery & Analysis',
    description: 'Deep dive into your business processes to identify automation opportunities and define agent capabilities.',
  },
  {
    icon: Lightbulb,
    number: '02',
    title: 'Architecture Design',
    description: 'Design robust agent architectures with clear goals, decision frameworks, and integration points.',
  },
  {
    icon: Code2,
    number: '03',
    title: 'Development & Training',
    description: 'Build and train your AI agents using cutting-edge LLMs, custom tools, and domain-specific knowledge.',
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Deployment & Optimization',
    description: 'Deploy to production with monitoring, continuous learning, and iterative improvements.',
  },
];

const ProcessSection = () => {
  return (
    <section id="process" className="py-24 relative bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Process</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            From Concept to Autonomous Operation
          </h2>
          <p className="text-muted-foreground text-lg">
            A proven methodology to deliver AI agents that exceed expectations.
          </p>
        </div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex gap-6 md:gap-10 mb-12 last:mb-0"
            >
              {/* Left: Number & Line */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-px h-full bg-gradient-to-b from-primary/30 to-transparent mt-4" />
                )}
              </div>

              {/* Right: Content */}
              <div className="pb-12">
                <span className="text-primary font-display font-bold text-sm">Step {step.number}</span>
                <h3 className="font-display text-2xl font-bold mt-2 mb-3 text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
