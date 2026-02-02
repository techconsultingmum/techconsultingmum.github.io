import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface ContactFormDialogProps {
  children: React.ReactNode;
  formType: 'Schedule Consultation' | 'Book Free Consultation' | 'Contact Us';
}

const budgetOptions = [
  { value: 'under-5k', label: '< $5k' },
  { value: '5k-10k', label: '$5k - $10k' },
  { value: '10k-25k', label: '$10k - $25k' },
  { value: 'over-25k', label: '$25k+' },
];

const timelineOptions = [
  { value: 'immediately', label: 'Immediately' },
  { value: '1-3-months', label: '1–3 months' },
  { value: '3-6-months', label: '3–6 months' },
  { value: 'researching', label: 'Just researching' },
];

const serviceOptions = [
  { value: 'ai-automation', label: 'AI Automation' },
  { value: 'agentic-ai', label: 'Agentic AI Systems' },
  { value: 'chatbots', label: 'Chatbots' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'custom-ai', label: 'Custom AI Development' },
];

const WEBHOOK_URL = 'https://mogim.app.n8n.cloud/webhook/agenticai-lead-form';

const ContactFormDialog = ({ children, formType }: ContactFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    budget: '',
    timeline: '',
    serviceInterest: '',
    problemStatement: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      budget: '',
      timeline: '',
      serviceInterest: '',
      problemStatement: '',
      message: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Validate budget and timeline for consultation forms
    if (formType !== 'Contact Us' && (!formData.budget || !formData.timeline)) {
      toast({
        title: "Error",
        description: "Please select your estimated budget and project timeline.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
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
        formType,
        submittedAt: new Date().toISOString(),
        source: 'agenticailab.in',
      };

      // Send to webhook (fire and forget - don't block on failure)
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

      // Send confirmation email via edge function
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          company: formData.company.trim() || undefined,
          message: fullMessage,
          formType,
        },
      });

      if (error) throw error;

      toast({
        title: "Thanks! 🎉",
        description: "Our AI team will review your request shortly.",
      });

      resetForm();
      setOpen(false);
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

  const isConsultationForm = formType !== 'Contact Us';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Talk to AgenticAI Lab</DialogTitle>
          <DialogDescription>
            Fill out the form below and our AI team will review your request shortly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                maxLength={255}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 000 000 0000"
                maxLength={20}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company"
                maxLength={100}
              />
            </div>
          </div>

          {isConsultationForm && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Estimated Budget *</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => handleSelectChange('budget', value)}
                  >
                    <SelectTrigger className="bg-background">
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeline">Project Timeline *</Label>
                  <Select
                    value={formData.timeline}
                    onValueChange={(value) => handleSelectChange('timeline', value)}
                  >
                    <SelectTrigger className="bg-background">
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
                  value={formData.problemStatement}
                  onChange={handleChange}
                  placeholder="What problem are you looking to solve with AI?"
                  rows={3}
                  maxLength={1000}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">{isConsultationForm ? 'Additional Details' : 'Message *'}</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={isConsultationForm ? "Any other details you'd like to share..." : "Tell us about your project or inquiry..."}
              rows={isConsultationForm ? 2 : 4}
              required={!isConsultationForm}
              maxLength={1000}
            />
          </div>
          
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
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
      </DialogContent>
    </Dialog>
  );
};

export default ContactFormDialog;
