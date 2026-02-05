import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import ContactFormDialog from '@/components/ContactFormDialog';
import ImageWithLoading from '@/components/ui/image-with-loading';
import SkipToContent from '@/components/SkipToContent';
 import SEOHead from '@/components/SEOHead';

const caseStudies = [
  {
    id: 1,
    title: "AI-Powered Customer Service Automation",
    client: "Global Retail Chain",
    industry: "Retail",
    challenge: "Handling 50,000+ daily customer inquiries with limited support staff, leading to long wait times and customer dissatisfaction.",
    solution: "Implemented an intelligent chatbot system with natural language processing and seamless human handoff capabilities.",
    results: [
      { metric: "Response Time", value: "85%", label: "Reduction" },
      { metric: "Customer Satisfaction", value: "40%", label: "Increase" },
      { metric: "Cost Savings", value: "$2.5M", label: "Annually" },
    ],
    tags: ["NLP", "Chatbot", "Customer Service"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Predictive Maintenance for Manufacturing",
    client: "Industrial Manufacturing Corp",
    industry: "Manufacturing",
    challenge: "Unexpected equipment failures causing production delays and costing millions in downtime and emergency repairs.",
    solution: "Deployed IoT sensors with machine learning models to predict equipment failures before they occur.",
    results: [
      { metric: "Downtime", value: "70%", label: "Reduction" },
      { metric: "Maintenance Costs", value: "45%", label: "Decrease" },
      { metric: "Equipment Lifespan", value: "25%", label: "Increase" },
    ],
    tags: ["IoT", "Machine Learning", "Predictive Analytics"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Intelligent Document Processing",
    client: "Financial Services Firm",
    industry: "Finance",
    challenge: "Manual processing of thousands of documents daily, leading to errors, delays, and compliance risks.",
    solution: "Built an AI-powered document extraction and classification system with automated validation workflows.",
    results: [
      { metric: "Processing Speed", value: "10x", label: "Faster" },
      { metric: "Accuracy Rate", value: "99.5%", label: "Achieved" },
      { metric: "FTE Hours", value: "15,000", label: "Saved Yearly" },
    ],
    tags: ["OCR", "Document AI", "Automation"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    title: "Supply Chain Optimization",
    client: "Logistics Enterprise",
    industry: "Logistics",
    challenge: "Inefficient route planning and inventory management causing delivery delays and excess inventory costs.",
    solution: "Implemented AI-driven demand forecasting and dynamic route optimization across the supply chain.",
    results: [
      { metric: "Delivery Efficiency", value: "35%", label: "Improvement" },
      { metric: "Inventory Costs", value: "28%", label: "Reduction" },
      { metric: "Carbon Footprint", value: "20%", label: "Decrease" },
    ],
    tags: ["Optimization", "Forecasting", "Logistics"],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Personalized Healthcare Recommendations",
    client: "Healthcare Network",
    industry: "Healthcare",
    challenge: "Generic treatment plans not accounting for individual patient variations, leading to suboptimal outcomes.",
    solution: "Developed an AI system analyzing patient data to provide personalized treatment recommendations.",
    results: [
      { metric: "Patient Outcomes", value: "32%", label: "Better" },
      { metric: "Readmission Rate", value: "45%", label: "Lower" },
      { metric: "Treatment Time", value: "20%", label: "Reduced" },
    ],
    tags: ["Healthcare AI", "Personalization", "Analytics"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Fraud Detection System",
    client: "Digital Banking Platform",
    industry: "Banking",
    challenge: "Rising fraud attempts with traditional rule-based systems failing to catch sophisticated attacks.",
    solution: "Deployed real-time AI fraud detection with behavioral analysis and anomaly detection algorithms.",
    results: [
      { metric: "Fraud Detection", value: "95%", label: "Accuracy" },
      { metric: "False Positives", value: "60%", label: "Reduction" },
      { metric: "Losses Prevented", value: "$12M", label: "Annually" },
    ],
    tags: ["Fraud Detection", "Real-time AI", "Security"],
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
  },
];

const CaseStudies = () => {
  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
       <SEOHead 
         title="Case Studies"
         description="See how AgenticAI Lab has helped businesses transform with autonomous AI agents. Real results from real clients."
         canonicalUrl="/case-studies"
       />
      <Header />
      
      <main id="main-content">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
            Success Stories
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
            Real Results from <span className="text-gradient">AI Innovation</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Discover how leading organizations have transformed their operations and achieved 
            measurable business outcomes with our AI solutions.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">50+</div>
              <div className="text-sm text-muted-foreground">Projects Delivered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">$100M+</div>
              <div className="text-sm text-muted-foreground">Value Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {caseStudies.map((study) => (
              <Card key={study.id} className="overflow-hidden bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 group">
                <ImageWithLoading 
                  src={study.image} 
                  alt={`${study.title} - ${study.client} case study`}
                  className="aspect-video"
                />
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{study.industry}</Badge>
                    {study.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-xl">{study.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {study.client}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-1">Challenge</h4>
                    <p className="text-sm text-muted-foreground">{study.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-foreground mb-1">Solution</h4>
                    <p className="text-sm text-muted-foreground">{study.solution}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                    {study.results.map((result, idx) => (
                      <div key={idx} className="text-center">
                        <div className="text-2xl font-bold text-primary">{result.value}</div>
                        <div className="text-xs text-muted-foreground">{result.label}</div>
                        <div className="text-xs text-muted-foreground">{result.metric}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      </main>
      {/* CTA Section */}
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 via-background to-primary/5 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Ready to Write Your Success Story?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Let's discuss how AI can transform your business operations and drive measurable results.
              </p>
              <ContactFormDialog formType="Schedule Consultation">
                <Button size="lg">
                  Start Your AI Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </ContactFormDialog>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CaseStudies;
