import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "AgenticAI transformed our customer service operations. Their AI agents handle 80% of inquiries autonomously, with better satisfaction scores than before.",
    author: "Sarah Chen",
    role: "VP of Operations",
    company: "TechFlow Inc.",
  },
  {
    quote: "The team's expertise in multi-agent systems is unmatched. They built a complex document processing pipeline that saves us 200+ hours weekly.",
    author: "Marcus Rodriguez",
    role: "CTO",
    company: "LegalPro Solutions",
  },
  {
    quote: "From strategy to deployment, the process was seamless. Our AI agents are now core to our competitive advantage in the market.",
    author: "Jennifer Park",
    role: "CEO",
    company: "DataBridge Analytics",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-24 relative bg-card/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mt-4 mb-6">
            Trusted by Innovative Teams
          </h2>
          <p className="text-muted-foreground text-lg">
            Hear from leaders who've transformed their businesses with our agentic AI solutions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className="p-8 rounded-2xl bg-glass border border-border/50 hover:border-primary/30 transition-all duration-500"
            >
              <Quote className="w-10 h-10 text-primary/30 mb-6" />
              <p className="text-foreground text-lg leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>
              <div>
                <div className="font-semibold text-foreground">{testimonial.author}</div>
                <div className="text-muted-foreground text-sm">
                  {testimonial.role}, {testimonial.company}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
