import { Calendar, Scissors, PhoneCall, Truck, Calculator } from 'lucide-react';
import { CaseStudy } from './types';

// Sample case studies data used throughout the application.
// Data is frozen to prevent accidental mutations.
export const caseStudies = Object.freeze<CaseStudy[]>([
  {
    slug: 'task-automation-google-calendar',
    service: 'ai-chat-agents',
    title: 'Task Automation via Google Calendar API',
    client: 'Internal Team',
    industry: 'Professional Services',
    deployedPlatform: 'Telegram',
    icon: Calendar,
    tone: 'ember',
    metrics: {
      'Productivity Improvement': '+70%',
      'Error Reduction': '-95%',
      'User Satisfaction': '+40%',
      'Task Completion Time': '-60%',
    } as Record<string, string>,
    description:
      'Developed a Telegram bot on the Google Calendar API so the team can pull an event in one tap instead of searching the calendar by hand.',
    solution:
      'A custom Telegram bot offering real-time updates and task details tailored to enhance team productivity.',
    image: '/Case1.jpeg',
    implementation: [
      {
        title: 'Understanding the Problem',
        details: [
          'Conducted interviews with the team to identify inefficiencies in retrieving calendar information',
          'Found that team members often searched manually for specific events, leading to wasted time and errors',
        ],
      },
      {
        title: 'Designing the Workflow',
        details: [
          'Mapped out a workflow that included real-time data retrieval, user authentication, and intuitive command options through a Telegram bot',
          'Prioritized simplicity to ensure non-technical team members could use the bot with ease',
        ],
      },
      {
        title: 'API Integration',
        details: [
          'Set up access to the Google Calendar API to fetch and update calendar events',
          'Created functions to query the API based on user inputs, such as date, event type, or specific keywords',
        ],
      },
      {
        title: 'Bot Development',
        details: [
          'Designed the bot interface to support natural language queries like "What\'s my next meeting?" or "Show today\'s schedule"',
          'Implemented secure authentication to ensure only authorized users could access calendar data',
        ],
      },
      {
        title: 'Testing and Deployment',
        details: [
          "Simulated various scenarios, such as overlapping events and incomplete queries, to refine the bot's responses",
          'Deployed the bot to the team and monitored usage for additional tweaks',
        ],
      },
      {
        title: 'Results',
        details: [
          'The bot significantly reduced the time required to retrieve calendar details, with most users completing tasks in under 10 seconds',
          'It eliminated errors associated with manual searches, enhancing team reliability',
        ],
      },
    ],
  },
  {
    slug: 'ai-chat-agent-barber',
    service: 'ai-chat-agents',
    title: 'AI Chat Agent for a Home-Based Barber',
    client: 'Independent Barber',
    industry: 'Personal Services',
    deployedPlatform: 'Instagram',
    icon: Scissors,
    tone: 'ocean',
    metrics: {
      'Manual Scheduling Time Saved': '80%',
      'Repeat Appointments': '+25%',
      'New Client Growth': '+15%',
      'Response Time Improvement': '+50%',
    },
    description:
      'Designed an AI-powered chat agent that automates appointment scheduling and customer interactions via Instagram and WhatsApp for a home-based barber.',
    solution:
      'A smart chat agent capable of managing bookings, responding to inquiries, and personalizing client experiences across platforms.',
    image: '/Case2.jpeg',
    implementation: [
      {
        title: 'Understanding the Problem',
        details: [
          "Observed the barber's manual process of replying to appointment requests and answering FAQs",
          'Documented key pain points: delays in responses, scheduling conflicts, and missed opportunities',
        ],
      },
      {
        title: 'Designing the Workflow',
        details: [
          'Created a logic-based conversational flow to guide users through booking an appointment',
          'Included responses for FAQs about services, pricing, and location',
        ],
      },
      {
        title: 'Integration with Platforms',
        details: [
          'Connected the chat agent to Instagram and WhatsApp using appropriate integration tools',
          "Ensured the agent could pull and update availability from the barber's calendar",
        ],
      },
      {
        title: 'Personalization Features',
        details: [
          'Designed the system to recognize returning customers and retrieve their previous booking details',
          'Implemented personalized recommendations based on past preferences',
        ],
      },
      {
        title: 'Testing and Deployment',
        details: [
          'Simulated customer interactions to ensure the chat agent could handle complex queries',
          'Adjusted the chat flow from those simulations so a customer could finish the booking there',
        ],
      },
      {
        title: 'Results',
        details: [
          "Automated 80% of appointment bookings, freeing up the barber's time",
          'Improved customer retention through faster response times and personalized experiences',
        ],
      },
    ],
  },
  {
    slug: 'ai-sdr-call-agent',
    service: 'ai-voice-agents',
    title: 'AI SDR Call Agent for a Leads Manager',
    client: 'Leads Manager',
    industry: 'Sales and Marketing',
    deployedPlatform: 'Work Phone',
    icon: PhoneCall,
    tone: 'sand',
    metrics: {
      'Lead Qualification Accuracy': '+30%',
      'Human Agent Workload': '-50%',
      'Conversion Rate': '+20%',
      Scalability: '+100%',
    },
    description:
      'Created an AI Sales Development Representative (SDR) call agent to manage initial outreach, qualify leads, and transfer high-potential prospects to human sales reps.',
    solution:
      'A call agent using AI to automate outreach, evaluate lead quality, and escalate hot leads for closing by human agents.',
    image: '/Case3.jpeg',
    implementation: [
      {
        title: 'Understanding the Problem',
        details: [
          'Collaborated with the sales team to map the current process of outreach and lead qualification',
          'Identified inefficiencies in manually handling high volumes of initial calls',
        ],
      },
      {
        title: 'Designing the Workflow',
        details: [
          'Built a conversational agent with voice capabilities to conduct structured yet flexible conversations',
          'Integrated natural language understanding to handle variations in responses',
        ],
      },
      {
        title: 'Qualifying Leads',
        details: [
          'Developed a scoring mechanism based on predefined criteria',
          'Ensured the system could adapt over time based on feedback',
        ],
      },
      {
        title: 'Handoff Process',
        details: [
          'Built the handoff that sends a scored lead to the team with a real-time notification',
          'Included real-time notifications for immediate follow-up',
        ],
      },
      {
        title: 'Testing and Deployment',
        details: [
          'Ran A/B testing with the AI agent and human-only outreach',
          'Adjusted conversational flows based on common objections',
        ],
      },
      {
        title: 'Results',
        details: [
          'Increased overall conversion rates by 20%',
          'Reduced human agent workload by 50% while doubling lead volume',
        ],
      },
    ],
  },
  {
    slug: 'custom-saas-logistics',
    service: 'custom-saas-solutions',
    title: 'Custom SaaS for a Logistics Firm',
    client: 'Logistics Company',
    industry: 'Logistics and Supply Chain',
    deployedPlatform: 'Custom Software',
    icon: Truck,
    tone: 'moss',
    metrics: {
      'Delivery Time': '-30%',
      'Labor Costs': '-40%',
      'Customer Satisfaction': '+25%',
      'System Scalability': '+50%',
    },
    description:
      'Built a custom SaaS platform for route optimization, real-time tracking, and automated invoicing, tailored to improve operational efficiency and scalability for a logistics company.',
    solution:
      'A comprehensive SaaS platform integrating AI-driven logistics management, invoicing, and data visualization tools.',
    image: '/Case4.jpeg',
    implementation: [
      {
        title: 'Understanding the Problem',
        details: [
          'Conducted workshops to identify inefficiencies in route planning and tracking',
          'Mapped key bottlenecks in current operations',
        ],
      },
      {
        title: 'Designing the Workflow',
        details: [
          'Designed a modular SaaS platform for real-time updates',
          'Planned integration with existing fleet management systems',
        ],
      },
      {
        title: 'Route Optimization',
        details: [
          'Integrated machine learning for dynamic route calculation',
          'Enabled real-time adjustments based on conditions',
        ],
      },
      {
        title: 'Tracking Implementation',
        details: [
          'Implemented GPS-based tracking with live updates',
          'Created customer-facing tracking interface',
        ],
      },
      {
        title: 'Automated Billing',
        details: [
          'Designed automated invoicing triggered by delivery confirmation',
          'Integrated reporting tools for performance monitoring',
        ],
      },
      {
        title: 'Testing and Deployment',
        details: [
          "Simulated various scenarios to refine the platform's responses",
          'Deployed the platform and monitored usage for additional tweaks',
        ],
      },
      {
        title: 'Results',
        details: [
          'Reduced delivery times by 30% and labor costs by 40%',
          'Improved customer satisfaction and system scalability',
        ],
      },
    ],
  },
  {
    slug: 'crm-accounting-firm',
    service: 'crm-development',
    title: 'CRM Build for an Accounting Firm',
    client: 'Accounting Firm',
    industry: 'Financial Services',
    deployedPlatform: 'GoHighLevel',
    icon: Calculator,
    tone: 'ember',
    metrics: {
      'Client Retention': '+15%',
      'Administrative Work': '-30%',
      'Client Satisfaction': '+25%',
      Communication: '+40%',
    },
    description:
      'Built a CRM on GoHighLevel for an accounting firm so client records, tasks, and messages live in one place.',
    solution:
      'A centralized CRM platform integrated with accounting tools, offering automation for task management, communication, and client engagement.',
    image: '/Case5.jpeg',
    implementation: [
      {
        title: 'Understanding the Problem',
        details: [
          'Interviewed team members about existing processes',
          'Identified repetitive tasks for automation',
        ],
      },
      {
        title: 'Designing the Workflow',
        details: [
          'Designed solution tailored to accounting needs',
          'Created templates for common tasks',
        ],
      },
      {
        title: 'Tool Integration',
        details: [
          'Connected CRM with accounting software',
          'Eliminated manual data entry requirements',
        ],
      },
      {
        title: 'Portal Development',
        details: [
          'Built secure client portal for document sharing',
          'Implemented project tracking features',
        ],
      },
      {
        title: 'Automation Setup',
        details: [
          'Configured automated reminders and notifications',
          'Set up calendar integration for deadlines',
        ],
      },
      {
        title: 'Testing and Deployment',
        details: [
          "Simulated various scenarios to refine the CRM's responses",
          'Deployed the CRM and monitored usage for additional tweaks',
        ],
      },
      {
        title: 'Results',
        details: [
          'Improved client retention and satisfaction metrics',
          'Reduced administrative workload significantly',
        ],
      },
    ],
  },
]);
