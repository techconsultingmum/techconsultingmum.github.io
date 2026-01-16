import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI Agents in Enterprise Automation',
    excerpt: 'Discover how AI agents are revolutionizing business processes and what this means for the future of work.',
    category: 'AI Trends',
    author: 'Tech Team',
    date: 'Jan 15, 2026',
    readTime: '5 min read',
    image: '/placeholder.svg',
  },
  {
    id: 2,
    title: 'Building Scalable AI Solutions: Best Practices',
    excerpt: 'Learn the key principles and strategies for developing AI solutions that can grow with your business.',
    category: 'Development',
    author: 'Tech Team',
    date: 'Jan 10, 2026',
    readTime: '7 min read',
    image: '/placeholder.svg',
  },
  {
    id: 3,
    title: 'How Machine Learning is Transforming Customer Service',
    excerpt: 'Explore the impact of ML-powered chatbots and virtual assistants on customer experience.',
    category: 'Case Study',
    author: 'Tech Team',
    date: 'Jan 5, 2026',
    readTime: '4 min read',
    image: '/placeholder.svg',
  },
  {
    id: 4,
    title: 'Understanding Large Language Models for Business',
    excerpt: 'A comprehensive guide to LLMs and how they can be leveraged for various business applications.',
    category: 'AI Trends',
    author: 'Tech Team',
    date: 'Dec 28, 2025',
    readTime: '8 min read',
    image: '/placeholder.svg',
  },
  {
    id: 5,
    title: 'Data Privacy in the Age of AI',
    excerpt: 'Essential considerations for maintaining data privacy while implementing AI solutions.',
    category: 'Security',
    author: 'Tech Team',
    date: 'Dec 20, 2025',
    readTime: '6 min read',
    image: '/placeholder.svg',
  },
  {
    id: 6,
    title: 'Getting Started with AI Integration',
    excerpt: 'A step-by-step guide for businesses looking to incorporate AI into their existing workflows.',
    category: 'Development',
    author: 'Tech Team',
    date: 'Dec 15, 2025',
    readTime: '5 min read',
    image: '/placeholder.svg',
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Our Blog
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Insights & <span className="text-primary">Updates</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest trends in AI, machine learning, and automation. 
            Expert insights from our team.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="bg-card border-border hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4" variant="secondary">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                    <Button variant="ghost" size="sm" className="group-hover:text-primary">
                      Read More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-card/50">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-muted-foreground mb-8">
            Get the latest AI insights and updates delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:outline-none flex-1 max-w-md"
            />
            <Button size="lg">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
