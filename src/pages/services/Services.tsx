import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkipToContent from '@/components/SkipToContent';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Bot, Network, Plug, Compass, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: Bot,
    title: 'Agent Development',
    href: '/services/agent-development',
    description:
      'Custom autonomous AI agents that understand natural language, make decisions, and continuously improve through learning.',
    highlights: ['Custom agent architecture', 'Continuous learning', 'Real-time monitoring'],
  },
  {
    icon: Network,
    title: 'Multi-Agent Systems',
    href: '/services/multi-agent-systems',
    description:
      'Coordinated teams of AI agents that collaborate to automate complex, multi-step enterprise processes at scale.',
    highlights: ['Agent orchestration', 'Secure inter-agent messaging', 'Scalable coordination'],
  },
  {
    icon: Plug,
    title: 'AI Integration',
    href: '/services/ai-integration',
    description:
      'Seamless integration of AI agents, LLMs, and automation into your existing systems, data, and workflows.',
    highlights: ['API & system integration', 'Legacy modernization', 'Governed data flows'],
  },
  {
    icon: Compass,
    title: 'Strategy Consulting',
    href: '/services/strategy-consulting',
    description:
      'Practical agentic AI strategy, architecture, and implementation roadmaps — governed from day one.',
    highlights: ['AI readiness assessment', 'Governance frameworks', 'Implementation roadmaps'],
  },
];

const differentiators = [
  'AI-governed delivery model — decisions executed by an autonomous AI CEO system under legal governance',
  'Enterprise-grade security, compliance, and auditability built into every engagement',
  'Measurable outcomes: cost reduction, 24/7 autonomous operation, and faster decision cycles',
  'End-to-end partnership from strategy through deployment and continuous optimization',
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Agentic AI Consulting Services"
        description="Agentic AI consulting services for enterprises: autonomous agent development, multi-agent systems, AI integration, and governed AI strategy consulting."
        canonicalUrl="/services"
      />
      <SkipToContent />
      <Header />
      <main id="main-content">
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
                <span className="text-sm font-medium text-primary">Our Services</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Agentic AI Consulting <span className="text-gradient">Services</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                From strategy to deployment, we design, build, and govern autonomous AI systems
                that transform how your enterprise operates.
              </p>
              <Button asChild size="lg" className="rounded-full">
                <Link to="/get-started">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {services.map((service) => (
                <Link
                  key={service.href}
                  to={service.href}
                  className="group rounded-2xl border border-border bg-card/50 p-8 transition-colors duration-300 hover:border-primary/40 hover:bg-card"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h2 className="font-display text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.highlights.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-2 text-primary font-medium">
                    Learn more
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us */}
        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-center mb-12">
                Why Enterprises Choose <span className="text-gradient">AgenticAI Lab</span>
              </h2>
              <ul className="space-y-4">
                {differentiators.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-center mt-12">
                <Button asChild size="lg" className="rounded-full">
                  <Link to="/contact">
                    Talk to Our Team <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
