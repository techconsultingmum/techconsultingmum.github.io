import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useEffect, useState } from "react";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Deferred, non-critical UI (kept out of the initial bundle for faster LCP)
const ChatBot = lazy(() => import("./components/ChatBot"));
const CookieConsent = lazy(() => import("./components/CookieConsent"));

// The landing page is the LCP-critical route, so it ships in the initial graph.
import Index from "./pages/Index";

// Lazy-loaded pages for better performance
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Careers = lazy(() => import("./pages/Careers"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AgentDevelopment = lazy(() => import("./pages/services/AgentDevelopment"));
const MultiAgentSystems = lazy(() => import("./pages/services/MultiAgentSystems"));
const AIIntegration = lazy(() => import("./pages/services/AIIntegration"));
const StrategyConsulting = lazy(() => import("./pages/services/StrategyConsulting"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const ApiReference = lazy(() => import("./pages/ApiReference"));
const Docs = lazy(() => import("./pages/Docs"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));

const queryClient = new QueryClient();

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
      <CookieConsent />
      <ChatBot />
    </Suspense>
  );
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
