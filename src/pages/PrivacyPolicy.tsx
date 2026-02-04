import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkipToContent from '@/components/SkipToContent';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SkipToContent />
      <Header />
      <main id="main-content" className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-primary font-medium mb-2">AgenticAI Lab</p>
          <p className="text-muted-foreground mb-8">
            Last updated: February 1, 2026
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to AgenticAI Lab ("we," "our," or "us"). We are committed to protecting your 
                personal information and your right to privacy. This Privacy Policy explains how we 
                collect, use, disclose, and safeguard your information when you visit our website 
                agenticailab.in or engage with our AI consulting services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Personal Information:</strong> Name, email address, phone number, company name, job title</li>
                <li><strong>Business Information:</strong> Project requirements, budget estimates, timeline preferences</li>
                <li><strong>Communication Data:</strong> Messages, inquiries, and correspondence through our contact forms</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information, and usage patterns</li>
                <li><strong>Cookie Data:</strong> Preferences and session information as described in our Cookie Policy</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                AgenticAI Lab uses the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Provide, maintain, and improve our AI consulting services</li>
                <li>Process consultation requests and project inquiries</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Monitor and analyze usage trends and preferences</li>
                <li>Detect, investigate, and prevent fraudulent or unauthorized activities</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Service Providers:</strong> With trusted third-party vendors who assist us in operating our website and services</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, acquisition, or sale of assets</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                AgenticAI Lab implements industry-standard security measures to protect your personal 
                information. This includes encryption, secure data storage, access controls, and regular 
                security assessments. However, no method of transmission over the Internet is 100% secure, 
                and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Data Retention</h2>
              <p className="text-muted-foreground leading-relaxed">
                We retain your personal information only for as long as necessary to fulfill the purposes 
                outlined in this Privacy Policy, unless a longer retention period is required or permitted 
                by law. Typically, we retain client data for the duration of our business relationship plus 
                an additional period for legal and compliance purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience on our website. 
                These help us understand how you interact with our site, remember your preferences, and 
                improve our services. You can control cookie preferences through our cookie consent banner 
                or your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website may contain links to third-party websites or services. AgenticAI Lab is not 
                responsible for the privacy practices of these external sites. We encourage you to review 
                the privacy policies of any third-party sites you visit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Your Rights and Choices</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                <li><strong>Withdraw Consent:</strong> Withdraw previously given consent for data processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you are accessing our services from outside India, please be aware that your information 
                may be transferred to, stored, and processed in India where our servers are located. By 
                using our services, you consent to this transfer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not directed to individuals under the age of 18. We do not knowingly 
                collect personal information from children. If you believe we have inadvertently collected 
                information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                AgenticAI Lab may update this Privacy Policy from time to time. We will notify you of any 
                material changes by posting the new Privacy Policy on this page with an updated "Last updated" 
                date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-card/50 border border-border rounded-lg p-6 space-y-3">
                <p className="text-foreground font-semibold text-lg">AgenticAI Lab</p>
                <p className="text-muted-foreground">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:tech.consulting.mum@gmail.com" className="text-primary hover:underline">
                    tech.consulting.mum@gmail.com
                  </a>
                </p>
                <p className="text-muted-foreground">
                  <strong>Phone:</strong>{' '}
                  <a href="tel:+918652074439" className="text-primary hover:underline">
                    +91 8652074439
                  </a>
                </p>
                <p className="text-muted-foreground">
                  <strong>Location:</strong> Mumbai, India
                </p>
                <p className="text-muted-foreground">
                  <strong>Website:</strong>{' '}
                  <a href="https://agenticailab.in" className="text-primary hover:underline">
                    agenticailab.in
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
