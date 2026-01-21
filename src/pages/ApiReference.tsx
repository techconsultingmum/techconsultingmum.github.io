import { ArrowLeft, Code, Key, Server, Shield, Zap, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ApiReference = () => {
  const endpoints = [
    {
      method: 'POST',
      path: '/api/v1/agents/create',
      description: 'Create a new AI agent with specified configuration',
      auth: 'Bearer Token',
    },
    {
      method: 'GET',
      path: '/api/v1/agents/{id}',
      description: 'Retrieve agent details and current status',
      auth: 'Bearer Token',
    },
    {
      method: 'POST',
      path: '/api/v1/agents/{id}/execute',
      description: 'Execute a task using the specified agent',
      auth: 'Bearer Token',
    },
    {
      method: 'GET',
      path: '/api/v1/agents/{id}/logs',
      description: 'Fetch execution logs for an agent',
      auth: 'Bearer Token',
    },
    {
      method: 'DELETE',
      path: '/api/v1/agents/{id}',
      description: 'Deactivate and remove an agent',
      auth: 'Bearer Token',
    },
    {
      method: 'POST',
      path: '/api/v1/workflows/create',
      description: 'Create a multi-agent workflow',
      auth: 'Bearer Token',
    },
  ];

  const features = [
    {
      icon: Key,
      title: 'Authentication',
      description: 'Secure API key and OAuth 2.0 authentication methods',
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'WebSocket support for live agent status and execution updates',
    },
    {
      icon: Shield,
      title: 'Rate Limiting',
      description: 'Enterprise-grade rate limiting with customizable thresholds',
    },
    {
      icon: Server,
      title: 'Webhooks',
      description: 'Configure webhooks for agent events and workflow completions',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Hero */}
          <div className="max-w-4xl mb-16">
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-8 h-8 text-primary" />
              <span className="text-primary font-medium">Developer Resources</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              API Reference
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Integrate AgenticAI Lab's powerful autonomous agent capabilities into your applications 
              with our comprehensive REST API.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg">
                <Key className="w-4 h-4 mr-2" />
                Get API Key
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/documentation">
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Full Docs
                </Link>
              </Button>
            </div>
          </div>

          {/* API Features */}
          <section className="mb-16">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">API Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-card/50 border-border">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Endpoints */}
          <section className="mb-16">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">API Endpoints</h2>
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <Card key={index} className="bg-card/50 border-border">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <span className={`inline-flex px-3 py-1 rounded text-sm font-mono font-semibold w-fit ${
                        endpoint.method === 'GET' ? 'bg-green-500/20 text-green-400' :
                        endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                        endpoint.method === 'DELETE' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="font-mono text-foreground">{endpoint.path}</code>
                      <span className="text-muted-foreground flex-1">{endpoint.description}</span>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                        {endpoint.auth}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Code Example */}
          <section className="mb-16">
            <h2 className="text-2xl font-display font-bold text-foreground mb-8">Quick Start Example</h2>
            <Card className="bg-card border-border overflow-hidden">
              <CardHeader className="bg-muted/50 border-b border-border">
                <CardTitle className="text-sm font-mono">Create an Agent</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="p-6 overflow-x-auto text-sm">
                  <code className="text-muted-foreground">
{`curl -X POST https://api.agenticailab.com/v1/agents/create \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Customer Support Agent",
    "type": "conversational",
    "model": "gpt-4",
    "instructions": "You are a helpful customer support agent...",
    "tools": ["knowledge_base", "ticket_system"]
  }'`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </section>

          {/* CTA */}
          <section className="text-center py-12 px-6 rounded-2xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border">
            <h2 className="text-2xl font-display font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Contact our team to get your API credentials and start building with autonomous AI agents.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">Request API Access</Link>
            </Button>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ApiReference;
