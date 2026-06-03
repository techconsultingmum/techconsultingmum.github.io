export type DocBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "code"; lang: string; code: string; title?: string }
  | { type: "callout"; variant: "info" | "warning" | "success" | "note"; title?: string; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface DocPage {
  slug: string; // full path after /docs/
  category: string;
  categorySlug: string;
  title: string;
  description: string;
  updated: string;
  blocks: DocBlock[];
}

export interface DocCategory {
  slug: string;
  title: string;
  pages: { slug: string; title: string }[];
}

const UPDATED = "June 3, 2026";

// Helper to keep content compact yet rich
const code = (lang: string, code: string, title?: string): DocBlock => ({ type: "code", lang, code, title });
const p = (text: string): DocBlock => ({ type: "p", text });
const h2 = (text: string): DocBlock => ({ type: "h2", text });
const h3 = (text: string): DocBlock => ({ type: "h3", text });
const list = (items: string[], ordered = false): DocBlock => ({ type: "list", ordered, items });
const info = (text: string, title?: string): DocBlock => ({ type: "callout", variant: "info", title, text });
const warn = (text: string, title?: string): DocBlock => ({ type: "callout", variant: "warning", title, text });
const ok = (text: string, title?: string): DocBlock => ({ type: "callout", variant: "success", title, text });
const note = (text: string, title?: string): DocBlock => ({ type: "callout", variant: "note", title, text });

export const DOC_PAGES: DocPage[] = [
  // ============ GETTING STARTED ============
  {
    slug: "getting-started",
    category: "Getting Started",
    categorySlug: "getting-started",
    title: "Platform Overview",
    description: "Introduction to AgenticAI Lab — what it is, what it does, and how to navigate the docs.",
    updated: UPDATED,
    blocks: [
      p("AgenticAI Lab is an end-to-end platform for designing, deploying, and orchestrating autonomous AI agents in production environments. It combines an agent runtime, a tool integration layer, and an orchestration engine behind a unified API."),
      h2("Key features"),
      list([
        "Production-grade agent runtime with first-class observability",
        "Pluggable LLM providers (OpenAI, Anthropic, Google, custom)",
        "Native multi-agent orchestration with shared memory",
        "200+ pre-built tool connectors (CRM, DB, cloud, webhooks)",
        "Enterprise auth (OAuth 2.0, SAML, JWT) and audit logs",
      ]),
      h2("Architecture overview"),
      p("Every request flows through four layers: Gateway (auth + rate limits) → Orchestrator (routing + state) → Agent Runtime (tool calls + LLM I/O) → Storage (vector + relational)."),
      code("text", `┌─────────────────────────────────────────┐
│  Gateway   │  Auth · RateLimit · Routing │
├─────────────────────────────────────────┤
│  Orchestrator  │  State · Workflows     │
├─────────────────────────────────────────┤
│  Agent Runtime │  LLM · Tools · Memory  │
├─────────────────────────────────────────┤
│  Storage   │  Postgres · Vector · Blob  │
└─────────────────────────────────────────┘`),
      h2("Quick navigation"),
      list([
        "New here? Start with Installation, then Your First Agent.",
        "Building an integration? Jump to REST API or SDKs & Libraries.",
        "Going to production? Read Security Guidelines and Monitoring & Logging.",
      ]),
      info("All examples in these docs are copy-paste ready. Use the copy button on any code block."),
    ],
  },
  {
    slug: "installation",
    category: "Getting Started",
    categorySlug: "getting-started",
    title: "Installation",
    description: "Prerequisites, local setup, cloud deployment, and environment configuration.",
    updated: UPDATED,
    blocks: [
      h2("Prerequisites"),
      list([
        "Node.js 20+ or Python 3.10+",
        "An AgenticAI Lab account and API key",
        "Optional: Docker 24+ for self-hosted runs",
      ]),
      h2("Local setup"),
      code("bash", `# JavaScript / TypeScript
npm install @agenticailab/sdk

# Python
pip install agenticailab`),
      h2("Cloud deployment"),
      p("Deploy a managed instance in one command using the CLI:"),
      code("bash", `npx @agenticailab/cli deploy \\
  --region us-east-1 \\
  --plan production`),
      h2("Environment variables"),
      code("bash", `AGENTICAI_API_KEY=sk_live_...
AGENTICAI_BASE_URL=https://api.agenticailab.in
AGENTICAI_LOG_LEVEL=info`, ".env"),
      h2("Verification"),
      code("bash", `curl https://api.agenticailab.in/v1/health \\
  -H "Authorization: Bearer $AGENTICAI_API_KEY"
# => { "status": "ok", "region": "us-east-1" }`),
      ok("If you see status: ok, your installation is ready.", "Installation verified"),
    ],
  },
  {
    slug: "authentication",
    category: "Getting Started",
    categorySlug: "getting-started",
    title: "Authentication",
    description: "API keys, OAuth, JWT, and access token management.",
    updated: UPDATED,
    blocks: [
      h2("API keys"),
      p("API keys are the simplest way to authenticate server-to-server. Generate keys from Settings → API Keys. Treat them like passwords."),
      code("bash", `curl https://api.agenticailab.in/v1/agents \\
  -H "Authorization: Bearer sk_live_..."`),
      h2("OAuth 2.0"),
      p("Use OAuth for user-delegated access. Supported flows: Authorization Code, Client Credentials, PKCE."),
      code("text", `Authorization URL: https://auth.agenticailab.in/oauth/authorize
Token URL:         https://auth.agenticailab.in/oauth/token
Scopes:            agents:read agents:write workflows:execute`),
      h2("JWT authentication"),
      p("JWTs are issued after OAuth or via the /auth/token endpoint. Tokens expire in 1 hour; refresh tokens last 30 days."),
      h2("Access token management"),
      list([
        "Rotate keys every 90 days",
        "Scope tokens to the minimum required permissions",
        "Store secrets in a vault, never in code",
        "Revoke tokens immediately when staff leave",
      ]),
      warn("Never commit API keys to source control. Use environment variables or a secrets manager."),
    ],
  },
  {
    slug: "your-first-agent",
    category: "Getting Started",
    categorySlug: "getting-started",
    title: "Your First Agent",
    description: "Step-by-step guide to create and execute your first agent.",
    updated: UPDATED,
    blocks: [
      h2("1. Create the agent"),
      code("ts", `import { AgenticAI } from "@agenticailab/sdk";

const client = new AgenticAI({ apiKey: process.env.AGENTICAI_API_KEY });

const agent = await client.agents.create({
  name: "Support Triage",
  type: "conversational",
  model: "gpt-4o",
  instructions: "You triage customer tickets and route them to the right team.",
  tools: ["zendesk", "knowledge_base"],
});`),
      h2("2. Execute the agent"),
      code("ts", `const run = await client.agents.execute(agent.id, {
  input: "My invoice shows the wrong tax rate for the EU.",
});

console.log(run.output);
// => { route: "billing", priority: "high", summary: "..." }`),
      h2("3. Inspect the run"),
      p("Every execution produces a trace with LLM calls, tool invocations, and timings. View it in the dashboard or fetch via API."),
      code("ts", `const trace = await client.runs.getTrace(run.id);`),
      ok("You now have a working agent. Next: Basic Configuration."),
    ],
  },
  {
    slug: "basic-configuration",
    category: "Getting Started",
    categorySlug: "getting-started",
    title: "Basic Configuration",
    description: "Tune agent settings, runtime, and environment options.",
    updated: UPDATED,
    blocks: [
      h2("Agent settings"),
      code("ts", `{
  model: "gpt-4o",          // or "claude-3-5-sonnet", "gemini-1.5-pro"
  temperature: 0.2,         // 0 = deterministic, 1 = creative
  maxTokens: 4096,
  timeoutMs: 30_000,
  retries: 2,
  memory: { type: "summary", windowSize: 20 },
}`),
      h2("Runtime options"),
      list([
        "concurrency — max parallel executions per agent",
        "queueing — FIFO, priority, or fair-share",
        "fallbackModel — used when the primary model is rate-limited",
      ]),
      h2("Environment configuration"),
      code("yaml", `# agenticai.config.yaml
default_region: us-east-1
logging:
  level: info
  destinations: [stdout, datadog]
security:
  pii_redaction: true`),
      note("Configuration changes apply on the next execution; running jobs keep their original config."),
    ],
  },

  // ============ API REFERENCE ============
  {
    slug: "api/rest-api",
    category: "API Reference",
    categorySlug: "api",
    title: "REST API",
    description: "Base URLs, authentication, endpoints, pagination, and rate limits.",
    updated: UPDATED,
    blocks: [
      h2("Base URLs"),
      code("text", `Production: https://api.agenticailab.in/v1
Staging:    https://staging-api.agenticailab.in/v1`),
      h2("Authentication"),
      p("Pass your API key in the Authorization header on every request."),
      code("bash", `curl https://api.agenticailab.in/v1/agents \\
  -H "Authorization: Bearer $AGENTICAI_API_KEY"`),
      h2("Core endpoints"),
      { type: "table", headers: ["Method", "Path", "Description"], rows: [
        ["POST", "/agents", "Create agent"],
        ["GET", "/agents/:id", "Fetch agent"],
        ["POST", "/agents/:id/execute", "Run agent"],
        ["GET", "/runs/:id", "Fetch run"],
        ["GET", "/runs/:id/trace", "Fetch trace"],
        ["DELETE", "/agents/:id", "Delete agent"],
      ]},
      h2("Request / response example"),
      code("json", `POST /v1/agents/agt_123/execute
{
  "input": "Summarize the latest sales report.",
  "context": { "user_id": "u_42" }
}

200 OK
{
  "run_id": "run_abc",
  "status": "completed",
  "output": "Q2 revenue grew 18% QoQ ...",
  "usage": { "input_tokens": 412, "output_tokens": 188 }
}`),
      h2("Pagination"),
      p("List endpoints use cursor pagination. Pass ?cursor= and ?limit= (max 100)."),
      code("json", `{
  "data": [...],
  "next_cursor": "eyJpZCI6...",
  "has_more": true
}`),
      h2("Rate limits"),
      { type: "table", headers: ["Plan", "RPS", "Burst"], rows: [
        ["Free", "5", "10"],
        ["Pro", "60", "120"],
        ["Enterprise", "Custom", "Custom"],
      ]},
      warn("HTTP 429 responses include a Retry-After header. Always honor it."),
    ],
  },
  {
    slug: "api/websocket-api",
    category: "API Reference",
    categorySlug: "api",
    title: "WebSocket API",
    description: "Realtime agent streaming and event subscriptions.",
    updated: UPDATED,
    blocks: [
      h2("Connection"),
      code("ts", `const ws = new WebSocket("wss://realtime.agenticailab.in/v1");
ws.onopen = () => ws.send(JSON.stringify({
  type: "auth",
  token: "sk_live_..."
}));`),
      h2("Subscribing to events"),
      code("json", `{ "type": "subscribe", "channel": "runs:run_abc" }`),
      h2("Streaming responses"),
      code("json", `{ "type": "token", "run_id": "run_abc", "delta": "Hello" }
{ "type": "token", "run_id": "run_abc", "delta": ", world" }
{ "type": "done",  "run_id": "run_abc" }`),
      h2("Reconnection strategy"),
      list([
        "Exponential backoff starting at 1s, capped at 30s",
        "Resume with last_event_id to avoid duplicates",
        "Heartbeat ping every 25s",
      ]),
    ],
  },
  {
    slug: "api/sdks-libraries",
    category: "API Reference",
    categorySlug: "api",
    title: "SDKs & Libraries",
    description: "Official SDKs for JavaScript, TypeScript, Python, and Go.",
    updated: UPDATED,
    blocks: [
      h2("JavaScript / TypeScript"),
      code("bash", `npm install @agenticailab/sdk`),
      code("ts", `import { AgenticAI } from "@agenticailab/sdk";
const client = new AgenticAI({ apiKey: process.env.AGENTICAI_API_KEY });
const agents = await client.agents.list();`),
      h2("Python"),
      code("bash", `pip install agenticailab`),
      code("python", `from agenticailab import AgenticAI
client = AgenticAI(api_key=os.environ["AGENTICAI_API_KEY"])
agents = client.agents.list()`),
      h2("Go"),
      code("bash", `go get github.com/agenticailab/sdk-go`),
      h2("Community SDKs"),
      list(["Ruby", "Rust", "Elixir", "Java (Spring)"]),
      info("All official SDKs are MIT-licensed and ship with TypeScript types."),
    ],
  },
  {
    slug: "api/error-handling",
    category: "API Reference",
    categorySlug: "api",
    title: "Error Handling",
    description: "Error codes, HTTP status codes, and recovery strategies.",
    updated: UPDATED,
    blocks: [
      h2("Status codes"),
      { type: "table", headers: ["Code", "Meaning", "Recoverable"], rows: [
        ["400", "Bad request — invalid payload", "No"],
        ["401", "Unauthorized — bad/missing token", "After refresh"],
        ["403", "Forbidden — insufficient scope", "No"],
        ["404", "Not found", "No"],
        ["429", "Rate limited", "Yes, with backoff"],
        ["5xx", "Server error", "Yes, retry"],
      ]},
      h2("Error envelope"),
      code("json", `{
  "error": {
    "code": "agent.tool_failed",
    "message": "Tool 'zendesk' returned 502",
    "request_id": "req_2k9d...",
    "retryable": true
  }
}`),
      h2("Recovery strategies"),
      list([
        "Exponential backoff with jitter for 429 / 5xx",
        "Surface request_id in your logs for fast support",
        "Fall back to a smaller model on timeout",
      ]),
      warn("Never retry 4xx errors blindly — fix the request first."),
    ],
  },

  // ============ AGENT CONFIGURATION ============
  {
    slug: "agent-configuration/agent-types",
    category: "Agent Configuration",
    categorySlug: "agent-configuration",
    title: "Agent Types",
    description: "Conversational, workflow, task, and multi-agent role types.",
    updated: UPDATED,
    blocks: [
      h2("Conversational agents"),
      p("Best for chat, support, and assistants. Maintain dialogue state across turns."),
      h2("Workflow agents"),
      p("Execute multi-step pipelines with branching, retries, and human-in-the-loop steps."),
      h2("Task agents"),
      p("Single-shot, stateless agents optimized for throughput — classification, extraction, summarization."),
      h2("Multi-agent roles"),
      list([
        "Planner — decomposes goals into subtasks",
        "Executor — runs tools and produces outputs",
        "Critic — evaluates and revises results",
        "Coordinator — routes messages between agents",
      ]),
      info("Pick the simplest type that solves the problem. Promote later if needed."),
    ],
  },
  {
    slug: "agent-configuration/prompting-best-practices",
    category: "Agent Configuration",
    categorySlug: "agent-configuration",
    title: "Prompting Best Practices",
    description: "Principles, templates, and common mistakes.",
    updated: UPDATED,
    blocks: [
      h2("Principles"),
      list([
        "State the role, the task, and the output format explicitly",
        "Show 1–3 examples for non-trivial formats",
        "Constrain length and tone",
        "Specify what the agent should NOT do",
      ]),
      h2("Template"),
      code("text", `You are a {role}.
Your task: {task}.
Inputs: {inputs}.
Output JSON matching: { "field": "..." }.
Never: reveal internal reasoning, invent facts, exceed 200 words.`),
      h2("Common mistakes"),
      list([
        "Vague instructions like 'be helpful'",
        "No output format → unparseable responses",
        "Mixing system and user roles",
        "Hiding important constraints in long preambles",
      ]),
    ],
  },
  {
    slug: "agent-configuration/tool-integration",
    category: "Agent Configuration",
    categorySlug: "agent-configuration",
    title: "Tool Integration",
    description: "Function calling, custom tools, and tool configuration.",
    updated: UPDATED,
    blocks: [
      h2("Defining a tool"),
      code("ts", `await client.tools.create({
  name: "lookup_order",
  description: "Fetch an order by id",
  parameters: {
    type: "object",
    properties: { order_id: { type: "string" } },
    required: ["order_id"]
  },
  handler: "https://api.acme.com/orders/{order_id}"
});`),
      h2("Function calling"),
      p("The runtime injects tool schemas into every LLM call. Tool output is fed back automatically until the agent emits a final response or hits maxSteps."),
      h2("Integration patterns"),
      list([
        "REST handler — point at any HTTPS endpoint",
        "GraphQL — wrap a query as a tool",
        "Local code — run inline JS/Python for low-latency math",
      ]),
    ],
  },
  {
    slug: "agent-configuration/memory-context",
    category: "Agent Configuration",
    categorySlug: "agent-configuration",
    title: "Memory & Context",
    description: "Context windows, memory types, and session persistence.",
    updated: UPDATED,
    blocks: [
      h2("Memory types"),
      { type: "table", headers: ["Type", "Use case"], rows: [
        ["buffer", "Keep last N messages verbatim"],
        ["summary", "Rolling LLM summary of older turns"],
        ["vector", "Semantic recall from long conversation history"],
        ["entity", "Structured facts about users / projects"],
      ]},
      h2("Session persistence"),
      code("ts", `await client.agents.execute(agent.id, {
  input: "What did we decide yesterday?",
  sessionId: "user_42",
});`),
      h2("Best practices"),
      list([
        "Cap context with summarization to control token spend",
        "Store PII separately and reference by id",
        "Expire sessions after a defined idle window",
      ]),
    ],
  },

  // ============ MULTI-AGENT ============
  {
    slug: "multi-agent-systems/orchestration-patterns",
    category: "Multi-Agent Systems",
    categorySlug: "multi-agent-systems",
    title: "Orchestration Patterns",
    description: "Sequential, parallel, hierarchical, and router patterns.",
    updated: UPDATED,
    blocks: [
      h2("Sequential"),
      p("Output of agent A feeds agent B. Simple, deterministic, easy to debug."),
      h2("Parallel"),
      p("Multiple agents run concurrently on different aspects; results are merged. Best for latency-sensitive workloads."),
      h2("Hierarchical"),
      p("A planner agent assigns subtasks to specialists, then aggregates outputs."),
      h2("Router"),
      p("A lightweight router agent classifies the input and dispatches to the most suitable specialist."),
      code("text", `Input ─▶ Router ─┬─▶ BillingAgent
                 ├─▶ SupportAgent
                 └─▶ SalesAgent`),
    ],
  },
  {
    slug: "multi-agent-systems/agent-communication",
    category: "Multi-Agent Systems",
    categorySlug: "multi-agent-systems",
    title: "Agent Communication",
    description: "Message passing, shared memory, and event-driven patterns.",
    updated: UPDATED,
    blocks: [
      h2("Message passing"),
      code("ts", `await client.bus.send({ to: "executor", payload: { task } });`),
      h2("Shared memory"),
      p("Agents in the same workspace share a key-value memory and a vector store. Use namespaces to avoid collisions."),
      h2("Event-driven"),
      p("Subscribe agents to events emitted by other agents or external systems for decoupled architectures."),
    ],
  },
  {
    slug: "multi-agent-systems/workflow-design",
    category: "Multi-Agent Systems",
    categorySlug: "multi-agent-systems",
    title: "Workflow Design",
    description: "Modeling, error recovery, and worked examples.",
    updated: UPDATED,
    blocks: [
      h2("Modeling"),
      list([
        "Map the happy path first",
        "Identify external systems and failure modes",
        "Decide which steps need human approval",
      ]),
      h2("Error recovery"),
      list([
        "Retry transient failures with backoff",
        "Use compensating actions to undo partial work",
        "Dead-letter unrecoverable runs for review",
      ]),
      h2("Example: invoice processing"),
      code("text", `OCR → Validate → ClassifyVendor → MatchPO → Approve(human) → Post`),
    ],
  },
  {
    slug: "multi-agent-systems/scaling-strategies",
    category: "Multi-Agent Systems",
    categorySlug: "multi-agent-systems",
    title: "Scaling Strategies",
    description: "Horizontal scaling, load balancing, and queue systems.",
    updated: UPDATED,
    blocks: [
      h2("Horizontal scaling"),
      p("Agent workers are stateless and scale linearly. Add replicas; the orchestrator distributes work."),
      h2("Load balancing"),
      list([
        "Round-robin for uniform workloads",
        "Least-loaded for long-tailed latency",
        "Affinity routing when warm context matters",
      ]),
      h2("Queue systems"),
      p("Use the built-in queue for bursty workloads. Configure priority lanes for SLA-sensitive traffic."),
      h2("Performance optimization"),
      list([
        "Cache embeddings and tool results",
        "Prefer smaller models for routing decisions",
        "Batch tool calls when possible",
      ]),
    ],
  },

  // ============ INTEGRATIONS ============
  {
    slug: "integrations/crm-integration",
    category: "Integrations",
    categorySlug: "integrations",
    title: "CRM Integration",
    description: "Salesforce, HubSpot, and Zoho connectors.",
    updated: UPDATED,
    blocks: [
      h2("Salesforce"),
      code("ts", `await client.connectors.connect("salesforce", {
  instanceUrl: "https://acme.my.salesforce.com",
  clientId: process.env.SF_CLIENT_ID,
  clientSecret: process.env.SF_CLIENT_SECRET,
});`),
      h2("HubSpot"),
      p("OAuth-only. Required scopes: contacts, deals, tickets."),
      h2("Zoho"),
      p("Token-based; rotate refresh tokens every 60 days."),
      h2("Sample workflow"),
      code("text", `Inbound email → ExtractIntent → Upsert Contact → CreateDeal → NotifyOwner`),
    ],
  },
  {
    slug: "integrations/database-connectors",
    category: "Integrations",
    categorySlug: "integrations",
    title: "Database Connectors",
    description: "Postgres, MySQL, MongoDB, and vector databases.",
    updated: UPDATED,
    blocks: [
      h2("Postgres / MySQL"),
      code("ts", `await client.connectors.connect("postgres", {
  url: process.env.DATABASE_URL,
  ssl: true,
  readonly: true,
});`),
      h2("MongoDB"),
      p("Connect via SRV string. Define collection-level read/write scopes."),
      h2("Vector databases"),
      list(["pgvector", "Pinecone", "Weaviate", "Qdrant", "Chroma"]),
      warn("Always use read-only credentials for analytical agents."),
    ],
  },
  {
    slug: "integrations/cloud-services",
    category: "Integrations",
    categorySlug: "integrations",
    title: "Cloud Services",
    description: "AWS, Azure, and Google Cloud deployment.",
    updated: UPDATED,
    blocks: [
      h2("AWS"),
      p("Deploy via CloudFormation template or Terraform module. Supports PrivateLink for VPC isolation."),
      h2("Azure"),
      p("Available on Azure Marketplace. Integrates with Azure AD for SSO."),
      h2("Google Cloud"),
      p("Deploy to GKE or Cloud Run. Workload Identity Federation supported."),
      h2("Example: AWS deployment"),
      code("bash", `aws cloudformation deploy \\
  --template-file agenticai.yaml \\
  --stack-name agenticai-prod \\
  --capabilities CAPABILITY_IAM`),
    ],
  },
  {
    slug: "integrations/custom-webhooks",
    category: "Integrations",
    categorySlug: "integrations",
    title: "Custom Webhooks",
    description: "Create, secure, and handle webhooks reliably.",
    updated: UPDATED,
    blocks: [
      h2("Creating a webhook"),
      code("ts", `await client.webhooks.create({
  url: "https://acme.com/agenticai",
  events: ["run.completed", "run.failed"],
  secret: process.env.WEBHOOK_SECRET,
});`),
      h2("Signature validation"),
      code("ts", `import { createHmac, timingSafeEqual } from "crypto";

const sig = req.headers["x-agenticai-signature"];
const expected = createHmac("sha256", SECRET).update(req.rawBody).digest("hex");
if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
  return res.status(401).end();
}`),
      h2("Retry mechanism"),
      p("Failed deliveries retry 6 times with exponential backoff over 24 hours. Idempotency keys are included in every payload."),
      warn("Always verify signatures before processing. Unverified webhooks are an attack vector."),
    ],
  },

  // ============ BEST PRACTICES ============
  {
    slug: "best-practices/security-guidelines",
    category: "Best Practices",
    categorySlug: "best-practices",
    title: "Security Guidelines",
    description: "API security, secret management, and compliance.",
    updated: UPDATED,
    blocks: [
      h2("API security"),
      list([
        "Enforce TLS 1.2+ on all endpoints",
        "Use short-lived tokens with refresh rotation",
        "Apply per-endpoint rate limits and quotas",
      ]),
      h2("Secret management"),
      list([
        "Centralize secrets in a vault (AWS Secrets Manager, HashiCorp Vault)",
        "Never log secret values or request bodies",
        "Rotate on a schedule and on staff offboarding",
      ]),
      h2("Compliance"),
      p("Platform is SOC 2 Type II, GDPR, and HIPAA-ready. Sign a BAA before processing PHI."),
      warn("Treat agent outputs as untrusted user input when feeding them to downstream systems."),
    ],
  },
  {
    slug: "best-practices/performance-optimization",
    category: "Best Practices",
    categorySlug: "best-practices",
    title: "Performance Optimization",
    description: "Latency, caching, and resource management.",
    updated: UPDATED,
    blocks: [
      h2("Latency"),
      list([
        "Stream tokens to the user instead of waiting for full responses",
        "Use a smaller model for routing, a larger model for synthesis",
        "Co-locate the runtime with your database",
      ]),
      h2("Caching"),
      list([
        "Cache embeddings keyed by content hash",
        "Memoize tool calls with deterministic outputs",
        "Use prompt caching where available",
      ]),
      h2("Resource management"),
      p("Track tokens, tool calls, and cold starts. Set per-tenant budgets to prevent runaway costs."),
    ],
  },
  {
    slug: "best-practices/testing-strategies",
    category: "Best Practices",
    categorySlug: "best-practices",
    title: "Testing Strategies",
    description: "Unit, integration, and evaluation tests for agents.",
    updated: UPDATED,
    blocks: [
      h2("Unit testing"),
      p("Mock the LLM and tool layer. Assert on input parsing, output schema, and edge cases."),
      h2("Integration testing"),
      p("Hit a sandbox API key with realistic fixtures. Snapshot full traces and diff on changes."),
      h2("Agent evaluation"),
      code("ts", `await client.evals.run({
  agentId: "agt_123",
  dataset: "support_questions_v3",
  metrics: ["accuracy", "latency_p95", "cost_per_run"],
});`),
      h2("Automated testing"),
      list([
        "Run evals on every PR",
        "Block merge on >2% regression",
        "Promote to prod only after canary",
      ]),
    ],
  },
  {
    slug: "best-practices/monitoring-logging",
    category: "Best Practices",
    categorySlug: "best-practices",
    title: "Monitoring & Logging",
    description: "Logs, metrics, observability, and alerting.",
    updated: UPDATED,
    blocks: [
      h2("Logs"),
      p("Every run emits structured JSON logs with request_id, agent_id, tokens, and latencies."),
      h2("Metrics"),
      list([
        "p50 / p95 / p99 latency",
        "Tokens per minute",
        "Tool failure rate",
        "Cost per 1k runs",
      ]),
      h2("Observability"),
      p("Native exports to Datadog, New Relic, Grafana, and OpenTelemetry."),
      h2("Alerting"),
      code("yaml", `alerts:
  - name: high_error_rate
    expr: error_rate > 0.05
    for: 5m
    severity: page
  - name: cost_spike
    expr: cost_per_hour > 50
    for: 15m
    severity: warn`),
      h2("Debugging workflows"),
      list([
        "Start from the failing run_id",
        "Inspect the trace timeline",
        "Replay locally with the SDK's debug mode",
      ]),
    ],
  },
];

export const DOC_CATEGORIES: DocCategory[] = (() => {
  const map = new Map<string, DocCategory>();
  for (const page of DOC_PAGES) {
    if (!map.has(page.categorySlug)) {
      map.set(page.categorySlug, { slug: page.categorySlug, title: page.category, pages: [] });
    }
    map.get(page.categorySlug)!.pages.push({ slug: page.slug, title: page.title });
  }
  return Array.from(map.values());
})();

export function findDocBySlug(slug: string): DocPage | undefined {
  return DOC_PAGES.find((p) => p.slug === slug);
}

export function getPrevNext(slug: string): { prev?: DocPage; next?: DocPage } {
  const idx = DOC_PAGES.findIndex((p) => p.slug === slug);
  if (idx === -1) return {};
  return { prev: DOC_PAGES[idx - 1], next: DOC_PAGES[idx + 1] };
}