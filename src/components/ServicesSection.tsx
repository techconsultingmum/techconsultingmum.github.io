import { Bot, Brain, Cog, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Bot,
    title: 'Autonomous Agent Development',
    description: 'Design and build custom AI agents that autonomously execute complex tasks, make decisions, and continuously improve through learning.',
    href: '/services/agent-development',
  },
  {
    icon: Brain,
    title: 'Multi-Agent Systems',
    description: 'Orchestrate multiple specialized AI agents working together to solve intricate business problems with unprecedented efficiency.',
    href: '/services/multi-agent-systems',
  },
  {
    icon: Cog,
    title: 'AI Integration & Deployment',
    description: 'Seamlessly integrate agentic AI into your existing infrastructure with enterprise-grade security and scalability.',
    href: '/services/ai-integration',
  },
  {
    icon: LineChart,
    title: 'AI Strategy Consulting',
    description: 'Strategic roadmaps to identify high-impact AI opportunities and prioritize implementations for maximum ROI.',
    href: '/services/strategy-consulting',
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Our Services</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            End-to-End Agentic AI Solutions
          </h2>
          <p className="text-muted-foreground text-lg">
            From strategy to deployment, we deliver autonomous AI systems that transform how your business operates.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={service.href}
              className="group p-8 rounded-2xl bg-glass border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-glow block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                <service.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-4 text-foreground">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
