export const SITE_URL = "https://agenticailab.in";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const blogPosts = [
  {
    slug: "future-of-ai-agents-enterprise-automation",
    title: "The Future of AI Agents in Enterprise Automation",
    description: "Discover how autonomous AI agents are revolutionizing business processes, reducing costs, and enabling 24/7 enterprise automation.",
    author: "Sateesh Singh",
    section: "AI Trends",
    publishedTime: "2026-01-15T00:00:00.000Z",
  },
  {
    slug: "building-scalable-ai-solutions-best-practices",
    title: "Building Scalable AI Solutions: Best Practices",
    description: "Learn the principles and architecture patterns for developing AI solutions that scale reliably with business demand.",
    author: "Michael Rodriguez",
    section: "Development",
    publishedTime: "2026-01-10T00:00:00.000Z",
  },
  {
    slug: "machine-learning-transforming-customer-service",
    title: "How Machine Learning is Transforming Customer Service",
    description: "Explore ML-powered chatbots and virtual assistants that improve customer satisfaction, response speed, and support efficiency.",
    author: "Emily Watson",
    section: "Case Study",
    publishedTime: "2026-01-05T00:00:00.000Z",
  },
  {
    slug: "understanding-large-language-models-business",
    title: "Understanding Large Language Models for Business",
    description: "A practical guide to large language models and how enterprises can apply them across operations, support, and research.",
    author: "Dr. James Liu",
    section: "AI Trends",
    publishedTime: "2025-12-28T00:00:00.000Z",
  },
  {
    slug: "data-privacy-age-of-ai",
    title: "Data Privacy in the Age of AI",
    description: "Essential privacy, compliance, and security considerations for implementing advanced AI solutions responsibly.",
    author: "Priya Sharma",
    section: "Security",
    publishedTime: "2025-12-20T00:00:00.000Z",
  },
  {
    slug: "getting-started-ai-integration-step-by-step-guide",
    title: "Getting Started with AI Integration: A Step-by-Step Guide",
    description: "A step-by-step roadmap for assessing, planning, and deploying AI integrations inside existing business workflows.",
    author: "Alex Thompson",
    section: "Tutorials",
    publishedTime: "2025-12-15T00:00:00.000Z",
  },
  {
    slug: "what-is-an-ai-agent",
    title: "What is an AI Agent: A Guide for Enterprise Leaders",
    description: "A foundational guide to AI agents, how they differ from static chatbots, and why governance matters for enterprise adoption.",
    author: "Sateesh Singh",
    section: "AI Trends",
    publishedTime: "2026-02-03T00:00:00.000Z",
  },
];

const baseRoutes = [
  { path: "/", title: "AgenticAI Lab — Agentic AI Solutions", description: "Build intelligent agentic AI solutions for enterprise transformation with autonomous agents, AI integration, and governed consulting systems.", priority: "1.0", changefreq: "weekly" },
  { path: "/about/", title: "About AgenticAI Lab", description: "Learn about AgenticAI Lab and our approach to autonomous AI systems for enterprise transformation.", priority: "0.8", changefreq: "monthly" },
  { path: "/contact/", title: "Contact AgenticAI Lab", description: "Contact AgenticAI Lab for AI consulting, agent development, and enterprise AI integration support.", priority: "0.8", changefreq: "monthly" },
  { path: "/get-started/", title: "Get Started with Agentic AI", description: "Start your enterprise AI transformation with AgenticAI Lab's consulting and implementation team.", priority: "0.9", changefreq: "monthly" },
  { path: "/case-studies/", title: "AI Case Studies", description: "Explore enterprise AI case studies and intelligent automation outcomes from AgenticAI Lab.", priority: "0.8", changefreq: "monthly" },
  { path: "/blog/", title: "AgenticAI Lab Blog", description: "Explore insights on AI agents, automation strategies, and the future of intelligent systems.", priority: "0.8", changefreq: "weekly" },
  { path: "/careers/", title: "Careers at AgenticAI Lab", description: "Join AgenticAI Lab and help build the future of autonomous AI systems for enterprise transformation.", priority: "0.7", changefreq: "weekly" },
  { path: "/services/agent-development/", title: "AI Agent Development Services", description: "Design and deploy intelligent AI agents for enterprise workflows, automation, and decision support.", priority: "0.8", changefreq: "monthly" },
  { path: "/services/multi-agent-systems/", title: "Multi-Agent AI Systems", description: "Build coordinated multi-agent AI systems that automate complex enterprise processes at scale.", priority: "0.8", changefreq: "monthly" },
  { path: "/services/ai-integration/", title: "Enterprise AI Integration", description: "Integrate AI agents, LLMs, and automation into your existing enterprise systems and workflows.", priority: "0.8", changefreq: "monthly" },
  { path: "/services/strategy-consulting/", title: "AI Strategy Consulting", description: "Plan governed AI adoption with practical strategy, architecture, and implementation roadmaps.", priority: "0.8", changefreq: "monthly" },
  { path: "/documentation/", title: "AgenticAI Lab Documentation", description: "Browse AgenticAI Lab documentation for services, APIs, architecture, governance, and implementation guidance.", priority: "0.6", changefreq: "monthly" },
  { path: "/docs/", title: "AgenticAI Lab Docs", description: "Browse AgenticAI Lab docs for service categories, AI systems, APIs, and implementation guidance.", priority: "0.6", changefreq: "monthly" },
  { path: "/unsubscribe/", title: "Unsubscribe", description: "Manage your AgenticAI Lab newsletter subscription preferences.", priority: "0.2", changefreq: "yearly", noIndex: true },
  { path: "/api-reference/", title: "API Reference", description: "Review AgenticAI Lab API reference documentation and integration guidance.", priority: "0.6", changefreq: "monthly" },
  { path: "/privacy-policy/", title: "Privacy Policy", description: "Read the AgenticAI Lab privacy policy and data handling practices.", priority: "0.3", changefreq: "yearly" },
  { path: "/terms-of-service/", title: "Terms of Service", description: "Read the AgenticAI Lab terms of service for website and consulting engagements.", priority: "0.3", changefreq: "yearly" },
];

export const routes = [
  ...baseRoutes,
  ...blogPosts.map((post) => ({
    path: `/blog/${post.slug}/`,
    title: post.title,
    description: post.description,
    priority: "0.7",
    changefreq: "monthly",
    type: "article",
    article: post,
  })),
];