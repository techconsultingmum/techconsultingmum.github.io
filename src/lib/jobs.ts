export interface JobOpening {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export const jobOpenings: JobOpening[] = [
  {
    slug: 'senior-ai-ml-engineer',
    title: 'Senior AI/ML Engineer',
    department: 'Engineering',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    description: 'Design and implement cutting-edge AI agents and machine learning models.',
    responsibilities: [
      'Design, train and deploy production machine learning and agentic systems.',
      'Own model evaluation, guardrails and observability for autonomous agents.',
      'Partner with solution architects to translate client needs into technical designs.',
    ],
    requirements: [
      '5+ years building ML or AI systems in production.',
      'Strong Python skills and experience with modern LLM tooling.',
      'Experience with cloud infrastructure and MLOps practices.',
    ],
  },
  {
    slug: 'full-stack-developer',
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote / New York',
    type: 'Full-time',
    description: 'Build and scale our enterprise AI platform using React, Node.js, and cloud technologies.',
    responsibilities: [
      'Develop and maintain customer-facing product surfaces end to end.',
      'Build reliable APIs and integrations with AI services.',
      'Champion performance, accessibility and code quality.',
    ],
    requirements: [
      '4+ years of full stack development experience.',
      'Expertise in React, TypeScript and Node.js.',
      'Comfort working with cloud platforms and CI/CD.',
    ],
  },
  {
    slug: 'ai-solutions-architect',
    title: 'AI Solutions Architect',
    department: 'Solutions',
    location: 'Remote / London',
    type: 'Full-time',
    description: 'Design custom AI solutions for enterprise clients and lead implementation projects.',
    responsibilities: [
      'Lead solution discovery and architecture for enterprise engagements.',
      'Guide delivery teams through implementation and rollout.',
      'Advise stakeholders on AI governance and risk.',
    ],
    requirements: [
      '6+ years in solution architecture or technical consulting.',
      'Hands-on experience delivering AI or data platforms.',
      'Excellent client-facing communication skills.',
    ],
  },
  {
    slug: 'product-manager-ai-platform',
    title: 'Product Manager - AI Platform',
    department: 'Product',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    description: 'Define and drive the product roadmap for our AI agent platform.',
    responsibilities: [
      'Own the roadmap, discovery and prioritisation for the agent platform.',
      'Work closely with engineering and design on delivery.',
      'Translate customer insight into measurable product outcomes.',
    ],
    requirements: [
      '4+ years of product management experience in B2B software.',
      'Strong technical fluency with AI or developer products.',
      'Track record of shipping impactful features.',
    ],
  },
  {
    slug: 'technical-writer',
    title: 'Technical Writer',
    department: 'Documentation',
    location: 'Remote',
    type: 'Full-time',
    description: 'Create clear, comprehensive documentation for our AI products and APIs.',
    responsibilities: [
      'Write and maintain product, API and onboarding documentation.',
      'Collaborate with engineers to document new releases.',
      'Improve information architecture and content standards.',
    ],
    requirements: [
      '3+ years writing technical documentation for software products.',
      'Ability to read code and understand APIs.',
      'Exceptional written English.',
    ],
  },
  {
    slug: 'enterprise-sales-executive',
    title: 'Enterprise Sales Executive',
    department: 'Sales',
    location: 'Remote / Chicago',
    type: 'Full-time',
    description: 'Drive enterprise sales and build relationships with Fortune 500 clients.',
    responsibilities: [
      'Own the full enterprise sales cycle from prospecting to close.',
      'Build trusted relationships with senior stakeholders.',
      'Partner with solutions teams on proposals and pilots.',
    ],
    requirements: [
      '5+ years of enterprise B2B sales experience.',
      'History of exceeding quota on complex deals.',
      'Understanding of AI or data technology markets.',
    ],
  },
];

export const getJobBySlug = (slug?: string) =>
  jobOpenings.find((job) => job.slug === slug);
