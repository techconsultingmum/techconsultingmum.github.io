// Shared form configuration for contact/consultation forms
// This eliminates duplication between ContactFormDialog and Contact page

export const budgetOptions = [
  { value: 'under-5k', label: '< $5k' },
  { value: '5k-10k', label: '$5k - $10k' },
  { value: '10k-25k', label: '$10k - $25k' },
  { value: 'over-25k', label: '$25k+' },
] as const;

export const timelineOptions = [
  { value: 'immediately', label: 'Immediately' },
  { value: '1-3-months', label: '1–3 months' },
  { value: '3-6-months', label: '3–6 months' },
  { value: 'researching', label: 'Just researching' },
] as const;

export const serviceOptions = [
  { value: 'ai-automation', label: 'AI Automation' },
  { value: 'agentic-ai', label: 'Agentic AI Systems' },
  { value: 'chatbots', label: 'Chatbots' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'custom-ai', label: 'Custom AI Development' },
] as const;

export const industryOptions = [
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'retail', label: 'Retail & E-commerce' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'education', label: 'Education' },
  { value: 'real-estate', label: 'Real Estate' },
  { value: 'legal', label: 'Legal' },
  { value: 'marketing', label: 'Marketing & Advertising' },
  { value: 'other', label: 'Other' },
] as const;

// Webhook URL removed from client-side code for security
// All webhook calls now go through the edge function

// Helper functions to get labels from values
export const getBudgetLabel = (value: string): string => 
  budgetOptions.find(o => o.value === value)?.label || value;

export const getTimelineLabel = (value: string): string => 
  timelineOptions.find(o => o.value === value)?.label || value;

export const getServiceLabel = (value: string): string => 
  serviceOptions.find(o => o.value === value)?.label || value;

export const getIndustryLabel = (value: string): string => 
  industryOptions.find(o => o.value === value)?.label || value;

// Form types
export type FormType = 'Talk to AgenticAI Lab' | 'Newsletter Subscription';

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  industry: string;
  budget: string;
  timeline: string;
  serviceInterest: string;
  problemStatement: string;
}

export const initialFormData: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  industry: '',
  budget: '',
  timeline: '',
  serviceInterest: '',
  problemStatement: '',
};
