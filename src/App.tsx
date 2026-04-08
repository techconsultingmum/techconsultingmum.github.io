import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import CookieConsent from "./components/CookieConsent";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy-loaded pages for better performance 
const Index = lazy(() => import("./pages/Index"));
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
const Documentation = lazy(() => import("./pages/Documentation"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <LoadingSpinner size="lg" label="Loading page..." />
  </div>
);

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
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/services/agent-development" element={<AgentDevelopment />} />
                <Route path="/services/multi-agent-systems" element={<MultiAgentSystems />} />
                <Route path="/services/ai-integration" element={<AIIntegration />} />
                <Route path="/services/strategy-consulting" element={<StrategyConsulting />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <CookieConsent />
            <ScrollToTop />
          </ErrorBoundary>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
