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
  title: string;
  description: string;
  details: ServiceDetails;
}

export const services: readonly Service[] = [
  {
    id: 'ai-chat-agents',
    title: 'AI Chat Agents',
    description: 'Transform how you engage with customers and streamline operations using smart AI Chat Agents built just for you.',
    details: {
      features: ['Text-based conversational agents', 'Task automation and workflow integration', '24/7 availability', 'Personalized responses and functionality'],
      benefits: ['Enhance customer engagement', 'Automate repetitive tasks', 'Improve response times and accuracy', 'Free up your team for higher-value activities'],
      useCase: 'Businesses aiming to automate customer service, streamline operations, and ensure personalized interactions with clients and team members.',
      extendedDescription: 'Our conversational AI agents deliver personalized, 24/7 support across multiple platforms, integrating seamlessly with your existing workflows to automate routine tasks while maintaining human-like interactions. From customer service to internal team communication, our chat agents understand context, learn from interactions, and continuously improve to provide exceptional experiences.',
    },
  },
  {
    id: 'ai-voice-agents',
    title: 'AI Voice Agents',
    description: 'Enhance customer experiences with conversational AI Voice Agents that handle calls like a pro.',
    details: {
      features: ['Multilingual voice assistants', 'Natural language processing', 'Integration with phones and apps', 'Real-time task execution'],
      benefits: ['Enhance customer experience', 'Reduce manual call handling', 'Ensure 24/7 availability', 'Support multiple languages'],
      useCase: 'For industries needing real-time, voice-based support—deploy a single agent or a coordinated team to suit your needs.',
      extendedDescription: 'Deploy intelligent voice assistants that understand natural language, support multiple languages, and execute tasks in real-time—perfect for customer support, sales, and appointment scheduling. Our voice agents can handle inbound calls, make outbound calls, integrate with your phone systems, and perform complex tasks like lead qualification, appointment booking, and information retrieval—all while sounding natural and professional.',
    },
  },
  {
    id: 'crm-development',
    title: 'CRM Development',
    description: 'Say goodbye to generic CRMs — let us build one perfectly designed for your needs.',
    details: {
      features: ['Fully customizable CRM platforms', 'Built-in automation', 'Seamless integration', 'Scalable solutions'],
      benefits: ['Streamline workflows', 'Improve team collaboration', 'Save on costs', 'Scale effortlessly'],
      useCase: 'Organizations seeking a CRM designed for their specific needs, eliminating unnecessary features and boosting productivity.',
      extendedDescription: 'We create fully customizable CRM platforms with built-in automation, seamless integration with your existing tools, and scalable solutions that grow with your business. Whether you need to manage customer relationships, track sales pipelines, automate marketing campaigns, or centralize your business data, we build CRMs that fit your unique processes—not the other way around.',
    },
  },
  {
    id: 'custom-saas-solutions',
    title: 'Custom SaaS Solutions',
    description: 'Bring your vision to life with custom-built software, tailored precisely to your needs.',
    details: {
      features: ['Custom software solutions', 'Robust architecture', 'API integration', 'Unique requirements'],
      benefits: ['Build unique products', 'Gain competitive edge', 'Ensure seamless UX/UI', 'Adapt as needed'],
      useCase: 'Businesses with unique software needs that require custom-built, scalable, and integrated SaaS solutions.',
      extendedDescription: 'When off-the-shelf software forces your team to work around it, we build the product that fits instead. We design and ship custom SaaS platforms with a robust architecture, clean API integrations with the tools you already run, and an interface your team and customers actually want to use. You own the result, and it is built to change as your business does.',
    },
  },
];
