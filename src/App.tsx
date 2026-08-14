import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, useEffect, useState } from "react";
import { lazyWithRetry } from "./lib/lazy-with-retry";
import ScrollToTop from "./components/ScrollToTop";
// Landing page is eager: it holds the LCP element, so an extra chunk hop hurts.
import Index from "./pages/Index";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Deferred, non-critical UI (kept out of the initial bundle for faster LCP)
const ChatBot = lazyWithRetry(() => import("./components/ChatBot"));
const CookieConsent = lazyWithRetry(() => import("./components/CookieConsent"));
const FeedbackFab = lazyWithRetry(() => import("./components/FeedbackFab"));
const Toaster = lazyWithRetry(() => import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })));
const Sonner = lazyWithRetry(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

// Lazy-loaded pages for better performance
const CaseStudies = lazyWithRetry(() => import("./pages/CaseStudies"));
const GetStarted = lazyWithRetry(() => import("./pages/GetStarted"));
const AboutUs = lazyWithRetry(() => import("./pages/AboutUs"));
const Careers = lazyWithRetry(() => import("./pages/Careers"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const Blog = lazyWithRetry(() => import("./pages/Blog"));
const BlogArticle = lazyWithRetry(() => import("./pages/BlogArticle"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));
const AgentDevelopment = lazyWithRetry(() => import("./pages/services/AgentDevelopment"));
const MultiAgentSystems = lazyWithRetry(() => import("./pages/services/MultiAgentSystems"));
const AIIntegration = lazyWithRetry(() => import("./pages/services/AIIntegration"));
const StrategyConsulting = lazyWithRetry(() => import("./pages/services/StrategyConsulting"));
const PrivacyPolicy = lazyWithRetry(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazyWithRetry(() => import("./pages/TermsOfService"));
const ApiReference = lazyWithRetry(() => import("./pages/ApiReference"));
const Docs = lazyWithRetry(() => import("./pages/Docs"));
const Unsubscribe = lazyWithRetry(() => import("./pages/Unsubscribe"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingSpinner size="lg" label="Loading page..." />
  </div>
);

/** Mounts non-critical widgets after the browser is idle so they never block first paint. */
const DeferredWidgets = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 3000 });
      return () => (window as any).cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setReady(true), 2000);
    return () => window.clearTimeout(t);
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <Toaster />
      <Sonner />
      <CookieConsent />
      <FeedbackFab />
      <ChatBot />
    </Suspense>
  );
};

const App = () => (
  <HelmetProvider>
      <TooltipProvider>
        <BrowserRouter>
          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/api-reference" element={<ApiReference />} />
                <Route path="/docs" element={<Docs />} />
                <Route path="/docs/*" element={<Docs />} />
                <Route path="/documentation" element={<Docs />} />
                <Route path="/services/agent-development" element={<AgentDevelopment />} />
                <Route path="/services/multi-agent-systems" element={<MultiAgentSystems />} />
                <Route path="/services/ai-integration" element={<AIIntegration />} />
                <Route path="/services/strategy-consulting" element={<StrategyConsulting />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <ScrollToTop />
            <DeferredWidgets />
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
  </HelmetProvider>
);

export default App;
