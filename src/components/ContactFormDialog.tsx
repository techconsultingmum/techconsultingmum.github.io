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
import {
  budgetOptions,
  timelineOptions,
  serviceOptions,
  getBudgetLabel,
  getTimelineLabel,
  getServiceLabel,
  initialFormData,
  type FormType,
} from '@/lib/form-config';
import { contactFormSchema } from '@/lib/validations';

interface ContactFormDialogProps {
  children: React.ReactNode;
  formType: FormType;
}

const ContactFormDialog = ({ children, formType }: ContactFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [honeypot, setHoneypot] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user selects
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setHoneypot('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate using Zod schema
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

    // Validate budget and timeline for consultation forms
    if (formType !== 'Contact Us') {
      if (!formData.budget) {
        setErrors((prev) => ({ ...prev, budget: 'Please select your estimated budget' }));
        return;
      }
      if (!formData.timeline) {
        setErrors((prev) => ({ ...prev, timeline: 'Please select your project timeline' }));
        return;
      }
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

      // Webhook is now handled server-side by the edge function for security

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
          budget: budgetLabel,
          timeline: timelineLabel,
          serviceInterest: serviceLabel || undefined,
          problemStatement: formData.problemStatement.trim() || undefined,
          message: fullMessage,
          formType,
          website: honeypot, // Honeypot field for bot detection
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
        <form onSubmit={handleSubmit} className="space-y-4 mt-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-name">Name *</Label>
              <Input
                id="dialog-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                maxLength={100}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "dialog-name-error" : undefined}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p id="dialog-name-error" className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-email">Email *</Label>
              <Input
                id="dialog-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                maxLength={255}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "dialog-email-error" : undefined}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p id="dialog-email-error" className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dialog-phone">Phone</Label>
              <Input
                id="dialog-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 000 000 0000"
                maxLength={20}
                aria-invalid={!!errors.phone}
                className={errors.phone ? 'border-destructive' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dialog-company">Company</Label>
              <Input
                id="dialog-company"
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
                  <Label htmlFor="dialog-budget">Estimated Budget *</Label>
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
                  <Label htmlFor="dialog-timeline">Project Timeline *</Label>
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
                <Label htmlFor="dialog-serviceInterest">Service Interested In</Label>
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
                <Label htmlFor="dialog-problemStatement">Briefly describe your challenge</Label>
                <Textarea
                  id="dialog-problemStatement"
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
            <Label htmlFor="dialog-message">{isConsultationForm ? 'Additional Details' : 'Message *'}</Label>
            <Textarea
              id="dialog-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={isConsultationForm ? "Any other details you'd like to share..." : "Tell us about your project or inquiry..."}
              rows={isConsultationForm ? 2 : 4}
              required={!isConsultationForm}
              maxLength={1000}
            />
          </div>
          
          {/* Honeypot field - hidden from users, visible to bots */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="website-field">Website</label>
            <input
              type="text"
              id="website-field"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
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
