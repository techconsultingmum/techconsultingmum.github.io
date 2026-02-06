import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Check, ArrowRight, Bot, Zap, Shield, Users } from 'lucide-react';
 import Header from '@/components/Header';
 import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import ContactFormDialog from '@/components/ContactFormDialog';
import SkipToContent from '@/components/SkipToContent';

const faqs = [
  {
    question: 'What is included in each pricing plan?',
    answer: 'Each plan includes a set number of AI agents, workflow automation capabilities, support levels, and API calls. The Starter plan is great for small businesses, Professional offers advanced features and priority support, while Enterprise provides unlimited resources and custom solutions.',
  },
  {
    question: 'Can I upgrade or downgrade my plan later?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll have immediate access to new features. When downgrading, changes take effect at the start of your next billing cycle.',
  },
  {
    question: 'How long does implementation typically take?',
    answer: 'Implementation timelines vary based on complexity. Simple automations can be deployed within 1-2 weeks, while comprehensive enterprise solutions typically take 4-8 weeks. We\'ll provide a detailed timeline during your consultation.',
  },
  {
    question: 'Do you offer a free trial or proof of concept?',
    answer: 'We offer a free 30-minute consultation to discuss your needs. For Enterprise clients, we can arrange a proof of concept to demonstrate value before full commitment.',
  },
  {
    question: 'What kind of support do you provide?',
    answer: 'Support varies by plan: Starter includes 8x5 support, Professional offers 24/7 priority support with a dedicated account manager, and Enterprise includes dedicated support teams with SLA guarantees.',
  },
  {
    question: 'Can I integrate with my existing systems?',
    answer: 'Yes! Our AI agents integrate with most popular business tools including CRMs, ERPs, communication platforms, and custom APIs. Professional and Enterprise plans include custom integration support.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Security is our top priority. We use enterprise-grade encryption, comply with SOC 2 and GDPR requirements, and offer on-premise deployment options for Enterprise clients with strict data residency requirements.',
  },
];

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small businesses getting started with AI',
    price: '$2,500',
    period: '/month',
    features: [
      'Up to 3 AI agents',
      'Basic workflow automation',
      '8x5 support',
      'Monthly performance reports',
      '10,000 API calls/month',
    ],
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing teams that need more power',
    price: '$7,500',
    period: '/month',
    features: [
      'Up to 10 AI agents',
      'Advanced workflow automation',
      '24/7 priority support',
      'Weekly performance reports',
      '100,000 API calls/month',
      'Custom integrations',
      'Dedicated account manager',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'Custom solutions for large organizations',
    price: 'Custom',
    period: '',
    features: [
      'Unlimited AI agents',
      'Enterprise-grade automation',
      '24/7 dedicated support',
      'Real-time analytics',
      'Unlimited API calls',
      'Custom development',
      'On-premise deployment option',
      'SLA guarantees',
    ],
    popular: false,
  },
];

const steps = [
  {
    icon: Users,
    title: 'Schedule a Consultation',
    description: 'Book a free 30-minute call to discuss your needs and goals.',
  },
  {
    icon: Zap,
    title: 'Custom Solution Design',
    description: 'Our team designs a tailored AI strategy for your business.',
  },
  {
    icon: Bot,
    title: 'Implementation',
    description: 'We build and deploy your AI agents with minimal disruption.',
  },
  {
    icon: Shield,
    title: 'Ongoing Support',
    description: 'Continuous optimization and 24/7 support to ensure success.',
  },
];

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-background">
       <SEOHead 
         title="Get Started"
         description="Transform your business with intelligent AI automation. Choose from flexible pricing plans and start your AI journey today with AgenticAI Lab."
         canonicalUrl="/get-started"
       />
       <SkipToContent />
      <Header />
      <main id="main-content" className="pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Start Your <span className="text-primary">AI Journey</span> Today
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Transform your business with intelligent automation. Choose the plan that fits your needs and let's build something amazing together.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.title} className="text-center">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Flexible pricing options designed to scale with your business
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative ${
                    plan.popular
                      ? 'border-primary shadow-lg shadow-primary/20 scale-105'
                      : 'border-border'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-display">{plan.name}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <ContactFormDialog>
                      <Button
                        variant={plan.popular ? 'default' : 'outline'}
                        className="w-full"
                        size="lg"
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </ContactFormDialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Got questions? We've got answers. Find everything you need to know about our services.
            </p>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border">
                    <AccordionTrigger className="text-left text-foreground hover:text-primary">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Schedule a free consultation and discover how AI agents can revolutionize your operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactFormDialog>
                <Button size="lg" className="text-lg px-8">
                  Schedule Consultation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </ContactFormDialog>
              <Link to="/case-studies">
                <Button variant="outline" size="lg" className="text-lg px-8">
                  View Case Studies
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GetStarted;
