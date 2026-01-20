import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-8">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 20, 2026
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using AgenticAI Lab's website and services, you accept and agree to be 
                bound by the terms and provisions of this agreement. If you do not agree to abide by 
                these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                AgenticAI Lab provides AI consulting services, including but not limited to autonomous 
                agent development, multi-agent systems, AI integration, and strategy consulting. The 
                specific scope of services will be defined in individual client agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As a user of our services, you agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide accurate and complete information when requested</li>
                <li>Maintain the confidentiality of any account credentials</li>
                <li>Use our services only for lawful purposes</li>
                <li>Not attempt to interfere with the proper functioning of our services</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                All content, features, and functionality of our website and services are owned by 
                AgenticAI Lab and are protected by international copyright, trademark, and other 
                intellectual property laws. Client-specific deliverables are subject to individual 
                service agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Confidentiality</h2>
              <p className="text-muted-foreground leading-relaxed">
                We maintain strict confidentiality regarding all client information and project details. 
                Both parties agree to protect any confidential information shared during the course of 
                our engagement as specified in individual service agreements.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                AgenticAI Lab shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of our services. Our total liability shall 
                not exceed the amount paid by you for the specific services giving rise to the claim.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Warranty Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are provided "as is" without warranties of any kind, either express or 
                implied. We do not warrant that our services will be uninterrupted, error-free, or 
                completely secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                Either party may terminate the service relationship with appropriate notice as specified 
                in individual agreements. Upon termination, all applicable provisions of these terms 
                shall survive.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of the 
                jurisdiction in which AgenticAI Lab operates, without regard to its conflict of law 
                provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes by posting the new terms on our website. Your continued use of our 
                services after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-muted-foreground mt-2">
                Email: <a href="mailto:tech.consulting.mum@gmail.com" className="text-primary hover:underline">tech.consulting.mum@gmail.com</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
