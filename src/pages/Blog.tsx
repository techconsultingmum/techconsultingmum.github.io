import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, ArrowRight, User, Bot, Brain, Shield, Code, TrendingUp, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const categories = ['All', 'AI Trends', 'Development', 'Case Study', 'Security', 'Tutorials'];

const blogPosts = [
  {
    id: 1,
    title: 'The Future of AI Agents in Enterprise Automation',
    excerpt: 'Discover how autonomous AI agents are revolutionizing business processes, reducing operational costs, and enabling 24/7 intelligent automation across industries.',
    category: 'AI Trends',
    author: 'Dr. Sarah Chen',
    date: 'Jan 15, 2026',
    readTime: '5 min read',
    icon: Bot,
    featured: true,
  },
  {
    id: 2,
    title: 'Building Scalable AI Solutions: Best Practices',
    excerpt: 'Learn the key principles and architectural patterns for developing AI solutions that can grow seamlessly with your business demands.',
    category: 'Development',
    author: 'Michael Rodriguez',
    date: 'Jan 10, 2026',
    readTime: '7 min read',
    icon: Code,
  },
  {
    id: 3,
    title: 'How Machine Learning is Transforming Customer Service',
    excerpt: 'Explore real-world implementations of ML-powered chatbots and virtual assistants that have increased customer satisfaction by 40%.',
    category: 'Case Study',
    author: 'Emily Watson',
    date: 'Jan 5, 2026',
    readTime: '4 min read',
    icon: TrendingUp,
  },
  {
    id: 4,
    title: 'Understanding Large Language Models for Business',
    excerpt: 'A comprehensive guide to LLMs including GPT, Claude, and Gemini - and how they can be leveraged for various enterprise applications.',
    category: 'AI Trends',
    author: 'Dr. James Liu',
    date: 'Dec 28, 2025',
    readTime: '8 min read',
    icon: Brain,
  },
  {
    id: 5,
    title: 'Data Privacy in the Age of AI',
    excerpt: 'Essential considerations and compliance frameworks for maintaining data privacy while implementing cutting-edge AI solutions.',
    category: 'Security',
    author: 'Priya Sharma',
    date: 'Dec 20, 2025',
    readTime: '6 min read',
    icon: Shield,
  },
  {
    id: 6,
    title: 'Getting Started with AI Integration: A Step-by-Step Guide',
    excerpt: 'From assessment to deployment - everything you need to know to successfully incorporate AI into your existing business workflows.',
    category: 'Tutorials',
    author: 'Alex Thompson',
    date: 'Dec 15, 2025',
    readTime: '5 min read',
    icon: Sparkles,
  },
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured || selectedCategory !== 'All');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4 px-4 py-1">
            <Sparkles className="w-3 h-3 mr-1" />
            Our Blog
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Insights & <span className="text-primary">Updates</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay ahead with the latest trends in AI, machine learning, and automation. 
            Expert insights from industry leaders.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && selectedCategory === 'All' && (
        <section className="py-8 px-4">
          <div className="container mx-auto">
            <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/20 overflow-hidden group">
              <div className="grid md:grid-cols-2 gap-8 p-6 md:p-10">
                <div className="flex flex-col justify-center">
                  <Badge className="w-fit mb-4 bg-primary/20 text-primary border-primary/30">
                    Featured Post
                  </Badge>
                  <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {featuredPost.author}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <Button className="w-fit group/btn">
                    Read Article
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="w-full aspect-square max-w-md bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                    <featuredPost.icon className="w-32 h-32 text-primary/60" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => {
              const IconComponent = post.icon;
              return (
                <Card 
                  key={post.id} 
                  className="bg-card border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group overflow-hidden"
                >
                  <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-10 h-10 text-primary" />
                    </div>
                    <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm" variant="secondary">
                      {post.category}
                    </Badge>
                  </div>
                  <CardHeader className="pb-3">
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
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        {post.author}
                      </span>
                      <Button variant="ghost" size="sm" className="group-hover:text-primary">
                        Read <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No posts found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/20 overflow-hidden">
            <div className="p-8 md:p-12 text-center relative">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <Badge variant="secondary" className="mb-4">
                  Newsletter
                </Badge>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Stay Ahead of the Curve
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-lg">
                  Get exclusive AI insights, industry trends, and expert tips delivered to your inbox weekly.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-background/80 backdrop-blur-sm"
                    required
                  />
                  <Button type="submit" size="lg">
                    Subscribe
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </form>
                <p className="text-sm text-muted-foreground mt-4">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
