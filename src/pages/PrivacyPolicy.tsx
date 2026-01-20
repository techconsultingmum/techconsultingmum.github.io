import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-8">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: January 20, 2026
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                request a consultation, subscribe to our newsletter, or contact us for support. This 
                information may include your name, email address, phone number, company name, and any 
                other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send promotional communications (with your consent)</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
                <li>Detect, investigate, and prevent fraudulent transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to outside parties. 
                This does not include trusted third parties who assist us in operating our website, 
                conducting our business, or servicing you, so long as those parties agree to keep this 
                information confidential.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement a variety of security measures to maintain the safety of your personal 
                information. Your personal information is contained behind secured networks and is only 
                accessible by a limited number of persons who have special access rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies to understand and save your preferences for future visits and compile 
                aggregate data about site traffic and site interaction so that we can offer better site 
                experiences and tools in the future.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                Occasionally, at our discretion, we may include or offer third-party products or services 
                on our website. These third-party sites have separate and independent privacy policies. 
                We therefore have no responsibility or liability for the content and activities of these 
                linked sites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, update, or delete your personal information at any time. 
                You can do this by contacting us directly. You also have the right to opt-out of 
                receiving promotional communications from us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
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

export default PrivacyPolicy;
