// One list for the home section, /services, /services/:id and the footer.
// `id` is also the URL segment — keep it in sync with scripts/routes.mjs.
// Text only, no icon imports: Head reads this eagerly for page titles.
export interface ServiceDetails {
  features: string[];
  benefits: string[];
  useCase: string;
  extendedDescription?: string;
}

export interface Service {
  id: string;
  /** Searchable name. Used in the document title, breadcrumb, and services index. */
  title: string;
  /** Positioning line shown as the page H1. */
  headline: string;
  description: string;
  details: ServiceDetails;
}

export const services: readonly Service[] = [
  {
    id: 'ai-chat-agents',
    title: 'AI Chat Agents',
    headline: 'Conversational systems that hold a role',
    description:
      "An agent that owns a conversation end to end — understands what's being asked, decides what to do, and does it. It reads your systems, takes the action, and hands off to a person when a person is genuinely needed.",
    details: {
      features: ['Text-based conversational agents', 'Task automation and workflow integration', '24/7 availability', 'Personalized responses and functionality'],
      benefits: ['Enhance customer engagement', 'Automate repetitive tasks', 'Improve response times and accuracy', 'Free up your team for higher-value activities'],
      useCase:
        'Companies where the same questions are answered by hand every day, and where the answer has to sound like it came from them.',
      extendedDescription: 'Built into the tools your team already uses, in the voice your brand already has.',
    },
  },
  {
    id: 'ai-voice-agents',
    title: 'AI Voice Agents',
    headline: 'Voice systems that do the job, not the demo',
    description:
      "We build voice agents around a role rather than a script: inbound discovery, customer success, win-back, the operator who never misses a call. Each one knows what it's for, what it's allowed to do, and when to pass the call to a person.",
    details: {
      features: ['Multilingual voice assistants', 'Natural language processing', 'Integration with phones and apps', 'Real-time task execution'],
      benefits: ['Enhance customer experience', 'Reduce manual call handling', 'Ensure 24/7 availability', 'Support multiple languages'],
      // TODO: link "Ask to hear it" once the voice demo URL is confirmed. The demo is not in this repo.
      useCase:
        "Companies losing work to calls nobody picks up, and companies who won't put a robot in front of a customer unless it's good enough.",
      extendedDescription: 'We run our own. Ask to hear it.',
    },
  },
  {
    id: 'crm-development',
    title: 'CRM Development',
    headline: 'The system your business actually runs on',
    description:
      'Most companies bend their process to fit the software. We build the software around the process — the pipeline as you actually run it, the fields you actually use, the reports you actually read.',
    details: {
      features: ['Fully customizable CRM platforms', 'Built-in automation', 'Connects to the systems you already run', 'Grows as the business does'],
      benefits: ['Streamline workflows', 'Improve team collaboration', 'Save on costs', 'Scale effortlessly'],
      useCase: "Teams who've outgrown the off-the-shelf tool and are tired of the workarounds holding it together.",
      extendedDescription: 'It connects to what you already have. Nobody has to change how they work to use it.',
    },
  },
  {
    id: 'custom-saas-solutions',
    title: 'Custom SaaS Solutions',
    headline: 'Products, built from nothing',
    description:
      'Phyizit and Shift Manager started as blank files. We designed them, built them, shipped them and still run them.',
    details: {
      features: ['Software built for one company', 'Architecture that holds under load', 'API integration', 'Unique requirements'],
      benefits: ['Build unique products', 'Gain competitive edge', 'An interface people want to use', 'Adapt as needed'],
      useCase:
        "Founders and companies building something that doesn't exist yet, who want it done properly the first time.",
      extendedDescription:
        "That's the same work we do for clients: an idea taken from nothing to a product people use, with one team owning every step.",
    },
  },
];
