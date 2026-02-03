import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .trim()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Please enter a valid email address' })
  .max(255, { message: 'Email must be less than 255 characters' });

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  email: emailSchema,
  phone: z
    .string()
    .trim()
    .max(20, { message: 'Phone must be less than 20 characters' })
    .regex(/^[\d\s\-+()]*$/, { message: 'Please enter a valid phone number' })
    .optional()
    .or(z.literal('')),
  company: z
    .string()
    .trim()
    .max(100, { message: 'Company must be less than 100 characters' })
    .optional()
    .or(z.literal('')),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  serviceInterest: z.string().optional(),
  problemStatement: z
    .string()
    .trim()
    .max(1000, { message: 'Description must be less than 1000 characters' })
    .optional()
    .or(z.literal('')),
  message: z
    .string()
    .trim()
    .max(1000, { message: 'Message must be less than 1000 characters' })
    .optional()
    .or(z.literal('')),
});

// Consultation form requires budget and timeline
export const consultationFormSchema = contactFormSchema.refine(
  (data) => data.budget && data.budget.length > 0,
  { message: 'Please select your estimated budget', path: ['budget'] }
).refine(
  (data) => data.timeline && data.timeline.length > 0,
  { message: 'Please select your project timeline', path: ['timeline'] }
);

// Simple contact form requires message
export const simpleContactFormSchema = contactFormSchema.refine(
  (data) => data.message && data.message.trim().length > 0,
  { message: 'Message is required', path: ['message'] }
);

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: emailSchema,
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
