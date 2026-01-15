import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, MapPin, Clock, Briefcase, Heart, Zap, Users, GraduationCap, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, and vision coverage for you and your family.',
  },
  {
    icon: Zap,
    title: 'Flexible Work',
    description: 'Remote-first culture with flexible hours and unlimited PTO.',
  },
  {
    icon: GraduationCap,
    title: 'Learning Budget',
    description: '$5,000 annual budget for courses, conferences, and professional development.',
  },
  {
    icon: Users,
    title: 'Team Events',
    description: 'Regular team retreats, hackathons, and social events to build connections.',
  },
];

const openings = [
  {
    title: 'Senior AI/ML Engineer',
    department: 'Engineering',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    description: 'Design and implement cutting-edge AI agents and machine learning models.',
  },
  {
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote / New York',
    type: 'Full-time',
    description: 'Build and scale our enterprise AI platform using React, Node.js, and cloud technologies.',
  },
  {
    title: 'AI Solutions Architect',
    department: 'Solutions',
    location: 'Remote / London',
    type: 'Full-time',
    description: 'Design custom AI solutions for enterprise clients and lead implementation projects.',
  },
  {
    title: 'Product Manager - AI Platform',
    department: 'Product',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    description: 'Define and drive the product roadmap for our AI agent platform.',
  },
  {
    title: 'Technical Writer',
    department: 'Documentation',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create clear, comprehensive documentation for our AI products and APIs.',
  },
  {
    title: 'Enterprise Sales Executive',
    department: 'Sales',
    location: 'Remote / Chicago',
    type: 'Full-time',
    description: 'Drive enterprise sales and build relationships with Fortune 500 clients.',
  },
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Briefcase className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">Join Our Team</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Build the Future of{' '}
                <span className="text-primary">AI</span> With Us
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Join a team of passionate innovators working on the cutting edge of autonomous AI systems. 
                We're looking for talented individuals who want to make an impact.
              </p>
              <Button size="lg" asChild>
                <a href="#openings">
                  View Open Positions
                  <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
              Why Join AgenticAI?
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              We offer more than just a job—we offer an opportunity to shape the future.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Culture Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                  Our Culture
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  At AgenticAI, we believe in fostering an environment where innovation thrives. 
                  We're a diverse team united by our passion for AI and our commitment to excellence.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span className="text-foreground">Collaborative and transparent work environment</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span className="text-foreground">Continuous learning and growth opportunities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span className="text-foreground">Work on challenging, impactful projects</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <span className="text-primary text-sm">✓</span>
                    </div>
                    <span className="text-foreground">Diverse, inclusive, and supportive team</span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <Bot className="w-8 h-8 text-primary" />
                    </div>
                    <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section id="openings" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Find your next opportunity and join our growing team.
            </p>
            <div className="max-w-4xl mx-auto space-y-4">
              {openings.map((job, index) => (
                <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <CardTitle className="text-foreground">{job.title}</CardTitle>
                        <CardDescription className="mt-1">{job.description}</CardDescription>
                      </div>
                      <Button>Apply Now</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {job.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {job.type}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Don't See Your Role?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <Link to="/contact">
              <Button size="lg">
                Get in Touch
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
