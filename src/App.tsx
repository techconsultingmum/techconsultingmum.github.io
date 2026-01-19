import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CaseStudies from "./pages/CaseStudies";
import GetStarted from "./pages/GetStarted";
import AboutUs from "./pages/AboutUs";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import AgentDevelopment from "./pages/services/AgentDevelopment";
import MultiAgentSystems from "./pages/services/MultiAgentSystems";
import AIIntegration from "./pages/services/AIIntegration";
import StrategyConsulting from "./pages/services/StrategyConsulting";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/services/agent-development" element={<AgentDevelopment />} />
          <Route path="/services/multi-agent-systems" element={<MultiAgentSystems />} />
          <Route path="/services/ai-integration" element={<AIIntegration />} />
          <Route path="/services/strategy-consulting" element={<StrategyConsulting />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
