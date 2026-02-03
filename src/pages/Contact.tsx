import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Bot, Mail, Phone, MapPin, Clock, MessageSquare, Headphones, Building, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  budgetOptions,
  timelineOptions,
  serviceOptions,
  WEBHOOK_URL,
  initialFormData,
} from '@/lib/form-config';
import { contactFormSchema } from '@/lib/validations';

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Send us an email anytime',
    value: 'tech.consulting.mum@gmail.com',
    href: 'mailto:tech.consulting.mum@gmail.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Mon-Fri from 9am to 6pm',
    value: '+91 8652074439',
    href: 'tel:+918652074439',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    description: 'Come say hello at our office',
    value: 'Mumbai, India',
    href: '#',
  },
];

const departments = [
  {
    icon: MessageSquare,
    title: 'Sales',
    description: 'Talk to our sales team about enterprise solutions.',
    email: 'sales@agenticailab.com',
  },
  {
    icon: Headphones,
    title: 'Support',
    description: 'Get help with technical issues and questions.',
    email: 'support@agenticailab.com',
  },
  {
    icon: Building,
    title: 'Partnerships',
    description: 'Explore partnership and integration opportunities.',
    email: 'partnerships@agenticailab.com',
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate using Zod
    const result = contactFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        title: "Validation Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
      return;
    }

    // Validate budget and timeline
    if (!formData.budget) {
      setErrors((prev) => ({ ...prev, budget: 'Please select your estimated budget' }));
      return;
    }
    if (!formData.timeline) {
      setErrors((prev) => ({ ...prev, timeline: 'Please select your project timeline' }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Get labels for the selected values
      const budgetLabel = budgetOptions.find(o => o.value === formData.budget)?.label || formData.budget;
      const timelineLabel = timelineOptions.find(o => o.value === formData.timeline)?.label || formData.timeline;
      const serviceLabel = serviceOptions.find(o => o.value === formData.serviceInterest)?.label || formData.serviceInterest;

      // Prepare webhook payload
      const webhookPayload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        company: formData.company.trim() || null,
        budget: budgetLabel,
        timeline: timelineLabel,
        serviceInterest: serviceLabel || null,
        problemStatement: formData.problemStatement.trim() || null,
        message: formData.message.trim() || null,
        formType: 'Contact Us',
        submittedAt: new Date().toISOString(),
        source: 'agenticailab.in',
      };

      // Send to webhook (fire and forget)
      fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      }).catch((err) => {
        console.error('Webhook error (non-blocking):', err);
      });

      // Prepare email message
      const fullMessage = [
        formData.message ? `Message: ${formData.message}` : '',
        formData.problemStatement ? `Challenge: ${formData.problemStatement}` : '',
        `Budget: ${budgetLabel}`,
        `Timeline: ${timelineLabel}`,
        serviceLabel ? `Service Interest: ${serviceLabel}` : '',
      ].filter(Boolean).join('\n\n');

      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          company: formData.company.trim() || undefined,
          message: fullMessage,
          formType: 'Contact Us',
        },
      });

      if (error) throw error;

      toast({
        title: 'Thanks! 🎉',
        description: 'Our AI team will review your request shortly.',
      });

      resetForm();
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">Contact Us</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Talk to <span className="text-primary">AgenticAI Lab</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Have questions about our AI solutions? We're here to help. 
                Reach out and our team will get back to you within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactMethods.map((method, index) => (
                <a
                  key={index}
                  href={method.href}
                  className="block"
                >
                  <Card className="bg-card border-border hover:border-primary/50 transition-all h-full text-center">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <method.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{method.title}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{method.description}</p>
                      <p className="text-primary font-medium">{method.value}</p>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Departments */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and our AI team will review your request shortly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">Full Name *</Label>
                        <Input
                          id="contact-name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          maxLength={100}
                          aria-invalid={!!errors.name}
                          className={errors.name ? 'border-destructive' : ''}
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email Address *</Label>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          maxLength={255}
                          aria-invalid={!!errors.email}
                          className={errors.email ? 'border-destructive' : ''}
                        />
                        {errors.email && (
                          <p className="text-sm text-destructive">{errors.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-phone">Phone</Label>
                        <Input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          placeholder="+91 000 000 0000"
                          value={formData.phone}
                          onChange={handleChange}
                          maxLength={20}
                          aria-invalid={!!errors.phone}
                          className={errors.phone ? 'border-destructive' : ''}
                        />
                        {errors.phone && (
                          <p className="text-sm text-destructive">{errors.phone}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-company">Company</Label>
                        <Input
                          id="contact-company"
                          name="company"
                          placeholder="Your Company"
                          value={formData.company}
                          onChange={handleChange}
                          maxLength={100}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact-budget">Estimated Budget *</Label>
                        <Select
                          value={formData.budget}
                          onValueChange={(value) => handleSelectChange('budget', value)}
                        >
                          <SelectTrigger 
                            className={`bg-background ${errors.budget ? 'border-destructive' : ''}`}
                            aria-invalid={!!errors.budget}
                          >
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border z-50">
                            {budgetOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.budget && (
                          <p className="text-sm text-destructive">{errors.budget}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact-timeline">Project Timeline *</Label>
                        <Select
                          value={formData.timeline}
                          onValueChange={(value) => handleSelectChange('timeline', value)}
                        >
                          <SelectTrigger 
                            className={`bg-background ${errors.timeline ? 'border-destructive' : ''}`}
                            aria-invalid={!!errors.timeline}
                          >
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border z-50">
                            {timelineOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.timeline && (
                          <p className="text-sm text-destructive">{errors.timeline}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceInterest">Service Interested In</Label>
                      <Select
                        value={formData.serviceInterest}
                        onValueChange={(value) => handleSelectChange('serviceInterest', value)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select service (optional)" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border z-50">
                          {serviceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="problemStatement">Briefly describe your challenge</Label>
                      <Textarea
                        id="problemStatement"
                        name="problemStatement"
                        placeholder="What problem are you looking to solve with AI?"
                        rows={3}
                        value={formData.problemStatement}
                        onChange={handleChange}
                        maxLength={1000}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Details</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Any other details you'd like to share..."
                        rows={2}
                        value={formData.message}
                        onChange={handleChange}
                        maxLength={1000}
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        'Get AI Solution'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Departments */}
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                  Contact by Department
                </h2>
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <Card key={index} className="bg-card border-border hover:border-primary/50 transition-all">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <dept.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-1">{dept.title}</h3>
                            <p className="text-muted-foreground text-sm mb-2">{dept.description}</p>
                            <a
                              href={`mailto:${dept.email}`}
                              className="text-primary hover:underline text-sm font-medium"
                            >
                              {dept.email}
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Office Hours */}
                <Card className="bg-card border-border mt-6">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-1">Office Hours</h3>
                        <p className="text-muted-foreground text-sm">
                          Monday - Friday: 9:00 AM - 6:00 PM IST<br />
                          Saturday - Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-card/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Schedule a free consultation to discuss your AI automation needs.
            </p>
            <Link to="/get-started">
              <Button size="lg">
                View Our Plans
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
