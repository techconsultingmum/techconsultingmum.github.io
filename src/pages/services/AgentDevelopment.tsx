import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Bot, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  'Custom AI agent architecture design',
  'Natural language understanding & generation',
  'Autonomous decision-making capabilities',
  'Continuous learning and improvement',
  'Real-time performance monitoring',
  'Seamless API integrations',
];

const useCases = [
  {
    title: 'Customer Support Agents',
    description: 'AI agents that handle customer inquiries 24/7 with human-like understanding and empathy.',
  },
  {
    title: 'Sales Automation',
    description: 'Intelligent agents that qualify leads, schedule meetings, and nurture prospects autonomously.',
  },
  {
    title: 'Process Automation',
    description: 'Agents that execute complex business workflows without human intervention.',
  },
];

const AgentDevelopment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                <Bot className="w-10 h-10 text-primary" />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Autonomous Agent Development
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Design and build custom AI agents that autonomously execute complex tasks, make decisions, and continuously improve through learning.
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
                See how autonomous agents are transforming businesses across industries.
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
              Ready to Build Your AI Agent?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Let's discuss how autonomous agents can transform your business operations.
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

export default AgentDevelopment;
