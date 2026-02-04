import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, Target, Users, Award, Lightbulb, Heart, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkipToContent from '@/components/SkipToContent';

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'We push the boundaries of what\'s possible with AI, constantly exploring new approaches to solve complex problems.',
  },
  {
    icon: Users,
    title: 'Client Partnership',
    description: 'We work alongside our clients as true partners, understanding their unique challenges and goals.',
  },
  {
    icon: Target,
    title: 'Results Driven',
    description: 'Every solution we build is measured by the tangible impact it delivers to your business.',
  },
  {
    icon: Heart,
    title: 'Ethical AI',
    description: 'We believe in responsible AI development that benefits businesses while respecting privacy and security.',
  },
];

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former AI Research Lead at Google with 15+ years in machine learning.',
  },
  {
    name: 'Marcus Johnson',
    role: 'CTO & Co-Founder',
    bio: 'Previously built AI infrastructure at Amazon, specializing in autonomous systems.',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Head of AI Solutions',
    bio: 'PhD in Computer Science from MIT, expert in multi-agent systems.',
  },
  {
    name: 'David Kim',
    role: 'VP of Engineering',
    bio: '20+ years of enterprise software experience, former Microsoft engineer.',
  },
];

const milestones = [
  { year: '2020', event: 'Founded with a vision to democratize AI agents' },
  { year: '2021', event: 'Launched first enterprise AI agent platform' },
  { year: '2022', event: 'Reached 100+ enterprise clients globally' },
  { year: '2023', event: 'Expanded to multi-agent orchestration systems' },
  { year: '2024', event: 'Achieved $50M+ in cost savings for clients' },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
      <Header />
      <main id="main-content" className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">About AgenticAI Lab</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Pioneering the Future of{' '}
                <span className="text-primary">Autonomous AI</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                We're a team of AI researchers, engineers, and business strategists on a mission 
                to transform how enterprises operate through intelligent automation.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  At AgenticAI Lab, we believe that the future of business lies in intelligent automation. 
                  Our mission is to empower organizations with AI agents that don't just assist—they 
                  autonomously execute, learn, and optimize.
                </p>
                <p className="text-muted-foreground text-lg mb-6">
                  We're building a world where businesses can focus on strategy and innovation while 
                  AI handles the complexity of execution. From customer service to operations, our 
                  agents work tirelessly to drive efficiency and growth.
                </p>
                <div className="flex gap-4">
                  <Link to="/get-started">
                    <Button size="lg">
                      Work With Us
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                  <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                    <Bot className="w-16 h-16 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              These principles guide everything we do, from how we build our technology to how we serve our clients.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
              Leadership Team
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Meet the experts driving innovation at AgenticAI Lab.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member, index) => (
                <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all">
                  <CardContent className="pt-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-primary text-sm mb-3">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              From startup to industry leader in autonomous AI solutions.
            </p>
            <div className="max-w-3xl mx-auto">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-border mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <span className="text-primary font-semibold">{milestone.year}</span>
                    <p className="text-foreground mt-1">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of enterprises already leveraging our AI solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/get-started">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
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

export default AboutUs;
