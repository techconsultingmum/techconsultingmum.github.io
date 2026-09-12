import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Briefcase, CheckCircle2, Clock, Loader2, MapPin, Upload, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkipToContent from '@/components/SkipToContent';
import SEOHead from '@/components/SEOHead';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getJobBySlug } from '@/lib/jobs';

const MAX_RESUME_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx', 'rtf', 'txt'];

const initialForm = {
  name: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  portfolio: '',
  experience: '',
  noticePeriod: '',
  expectedSalary: '',
  coverLetter: '',
};

const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result ?? '');
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });

const JobApplication = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const job = getJobBySlug(slug);
  const { toast } = useToast();

  const [form, setForm] = useState(initialForm);
  const [resume, setResume] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <SkipToContent />
        <SEOHead title="Position not found" description="This job opening is no longer available." noIndex />
        <Header />
        <main id="main-content" className="pt-32 pb-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-display font-bold text-foreground mb-4">Position not found</h1>
            <p className="text-muted-foreground mb-8">This opening may have been filled or removed.</p>
            <Button onClick={() => navigate('/careers')}>Back to all openings</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const setField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleResume = (file: File | null) => {
    if (!file) {
      setResume(null);
      return;
    }
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setErrors((prev) => ({ ...prev, resume: 'Please upload a PDF, DOC, DOCX, RTF or TXT file.' }));
      setResume(null);
      return;
    }
    if (file.size > MAX_RESUME_BYTES) {
      setErrors((prev) => ({ ...prev, resume: 'Your resume must be smaller than 5MB.' }));
      setResume(null);
      return;
    }
    setErrors((prev) => ({ ...prev, resume: '' }));
    setResume(file);
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (form.name.trim().length < 2) next.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    if (!/^[\d\s\-+()]{7,20}$/.test(form.phone.trim())) next.phone = 'Please enter a valid phone number.';
    if (form.coverLetter.length > 5000) next.coverLetter = 'Please keep your cover letter under 5000 characters.';
    if (!resume) next.resume = 'Please attach your resume.';
    setErrors(next);
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      const firstField = Object.keys(validationErrors)[0];
      document.getElementById(firstField)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const resumeBase64 = await fileToBase64(resume as File);
      const { data, error } = await supabase.functions.invoke('send-job-application', {
        body: {
          ...form,
          website: honeypot,
          jobTitle: job.title,
          jobSlug: job.slug,
          resumeName: (resume as File).name,
          resumeType: (resume as File).type || 'application/octet-stream',
          resumeBase64,
        },
      });

      if (error) throw new Error(error.message);
      if ((data as { error?: string })?.error) throw new Error((data as { error: string }).error);

      setSubmitted(true);
      toast({ title: 'Application sent', description: 'Thank you — our team will be in touch soon.' });
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "We couldn't submit your application. Please try again.";
      setServerError(message);
      toast({ title: 'Submission failed', description: message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
      <SEOHead
        title={`${job.title} — Apply`}
        description={`Apply for the ${job.title} role at AgenticAI Lab. ${job.description}`}
        canonicalUrl={`/careers/${job.slug}`}
      />
      <Header />
      <main id="main-content" className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/careers"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              All open positions
            </Link>

            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" />{job.department}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" />{job.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{job.type}</span>
            </div>
            <p className="text-lg text-muted-foreground mb-10">{job.description}</p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">What you'll do</h2>
                <ul className="space-y-2 text-muted-foreground text-sm list-disc pl-5">
                  {job.responsibilities.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">What we're looking for</h2>
                <ul className="space-y-2 text-muted-foreground text-sm list-disc pl-5">
                  {job.requirements.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            </div>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                {submitted ? (
                  <div className="text-center py-8" role="status">
                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-display font-bold text-foreground mb-2">Application received</h2>
                    <p className="text-muted-foreground mb-6">
                      Thanks for applying to the {job.title} role. Our team reviews every application and will get back to you soon.
                    </p>
                    <Button onClick={() => navigate('/careers')}>Browse more openings</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <h2 className="text-xl font-semibold text-foreground">Apply for this role</h2>

                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="hidden"
                    />

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full name *</Label>
                        <Input id="name" value={form.name} onChange={(e) => setField('name', e.target.value)}
                          aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
                        {errors.name && <p id="name-error" className="text-sm text-destructive">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)}
                          aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
                        {errors.email && <p id="email-error" className="text-sm text-destructive">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input id="phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)}
                          aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined} />
                        {errors.phone && <p id="phone-error" className="text-sm text-destructive">{errors.phone}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Current location</Label>
                        <Input id="location" value={form.location} onChange={(e) => setField('location', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of experience</Label>
                        <Input id="experience" value={form.experience} onChange={(e) => setField('experience', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="noticePeriod">Notice period / availability</Label>
                        <Input id="noticePeriod" value={form.noticePeriod} onChange={(e) => setField('noticePeriod', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn profile</Label>
                        <Input id="linkedin" value={form.linkedin} onChange={(e) => setField('linkedin', e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio / GitHub</Label>
                        <Input id="portfolio" value={form.portfolio} onChange={(e) => setField('portfolio', e.target.value)} />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="expectedSalary">Expected compensation</Label>
                        <Input id="expectedSalary" value={form.expectedSalary} onChange={(e) => setField('expectedSalary', e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume * (PDF, DOC, DOCX, RTF or TXT — max 5MB)</Label>
                      <input
                        ref={fileInputRef}
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx,.rtf,.txt"
                        onChange={(e) => handleResume(e.target.files?.[0] ?? null)}
                        aria-invalid={!!errors.resume}
                        aria-describedby={errors.resume ? 'resume-error' : undefined}
                        className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer rounded-md border border-input bg-background p-2"
                      />
                      {resume && (
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          {resume.name} ({Math.round(resume.size / 1024)} KB)
                        </p>
                      )}
                      {errors.resume && <p id="resume-error" className="text-sm text-destructive">{errors.resume}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="coverLetter">Why are you a great fit?</Label>
                      <Textarea
                        id="coverLetter"
                        rows={5}
                        maxLength={5000}
                        value={form.coverLetter}
                        onChange={(e) => setField('coverLetter', e.target.value)}
                      />
                      {errors.coverLetter && <p className="text-sm text-destructive">{errors.coverLetter}</p>}
                    </div>

                    {serverError && (
                      <div role="alert" className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{serverError}</span>
                      </div>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Submitting application...
                        </>
                      ) : (
                        'Submit application'
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobApplication;
