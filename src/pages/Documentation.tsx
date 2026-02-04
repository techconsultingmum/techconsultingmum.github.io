import { ArrowLeft, BookOpen, Code, FileText, Lightbulb, Rocket, Settings, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkipToContent from '@/components/SkipToContent';

const Documentation = () => {
  const sections = [
    {
      icon: Rocket,
      title: 'Getting Started',
      description: 'Quick start guide to deploy your first AI agent in minutes',
      articles: ['Installation', 'Authentication', 'Your First Agent', 'Basic Configuration'],
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'Complete API documentation with examples and code snippets',
      articles: ['REST API', 'WebSocket API', 'SDKs & Libraries', 'Error Handling'],
    },
    {
      icon: Settings,
      title: 'Agent Configuration',
      description: 'Deep dive into agent settings, behaviors, and customization',
      articles: ['Agent Types', 'Prompting Best Practices', 'Tool Integration', 'Memory & Context'],
    },
    {
      icon: Users,
      title: 'Multi-Agent Systems',
      description: 'Build complex workflows with multiple collaborating agents',
      articles: ['Orchestration Patterns', 'Agent Communication', 'Workflow Design', 'Scaling Strategies'],
    },
    {
      icon: FileText,
      title: 'Integrations',
      description: 'Connect agents to your existing tools and platforms',
      articles: ['CRM Integration', 'Database Connectors', 'Cloud Services', 'Custom Webhooks'],
    },
    {
      icon: Lightbulb,
      title: 'Best Practices',
      description: 'Guidelines for building reliable and efficient AI systems',
      articles: ['Security Guidelines', 'Performance Optimization', 'Testing Strategies', 'Monitoring & Logging'],
    },
  ];

  const quickLinks = [
    { label: 'API Reference', href: '/api-reference', icon: Code },
    { label: 'Get Started', href: '/get-started', icon: Rocket },
    { label: 'Contact Support', href: '/contact', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
      <Header />
      
      <main id="main-content" className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Hero */}
          <div className="max-w-4xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
              <span className="text-primary font-medium">Knowledge Base</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Documentation
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Everything you need to build, deploy, and scale autonomous AI agents with AgenticAI Lab.
            </p>
            
            {/* Search */}
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full px-4 py-3 pl-12 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          {/* Quick Links */}
          <section className="mb-16">
            <div className="flex flex-wrap gap-4">
              {quickLinks.map((link) => (
                <Button key={link.label} variant="outline" asChild>
                  <Link to={link.href}>
                    <link.icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Link>
                </Button>
              ))}
            </div>
          </section>

          {/* Documentation Sections */}
          <section className="mb-16">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">Browse by Topic</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <Card key={section.title} className="bg-card/50 border-border hover:border-primary/50 transition-colors group">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.articles.map((article) => (
                        <li key={article}>
                          <Link 
                            to="#" 
                            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-primary/50" />
                            {article}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Popular Articles */}
          <section className="mb-16">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">Popular Articles</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'How to create your first conversational AI agent',
                'Setting up multi-agent workflows for enterprise',
                'Best practices for agent prompt engineering',
                'Integrating AI agents with your CRM system',
                'Monitoring and debugging agent performance',
                'Security considerations for production deployments',
              ].map((article, index) => (
                <Card key={index} className="bg-card/50 border-border hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <Link to="#" className="text-foreground hover:text-primary transition-colors">
                      {article}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="text-center py-12 px-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Need Help?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our team is here to help you succeed. Reach out for personalized guidance and support.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/get-started">Schedule Demo</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Documentation;
