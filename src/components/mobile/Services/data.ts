import { MessageSquareText, Mic, LayoutDashboard, Code2 } from 'lucide-react';

/** Defines the structure of each service’s details. */
interface ServiceDetails {
  features: string[];
  benefits: string[];
  useCase: string;
}

/** Defines the structure for each service item. */
interface ServiceItem {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
  /** Mark if this service is highlighted or special in some contexts. */
  featured?: boolean;
  details: ServiceDetails;
}

/** 
 * A list of service offerings with icons, gradients, details, etc.
 * Perfect for displaying on your mobile Services page.
 */
export const services: ServiceItem[] = [
  {
    icon: MessageSquareText,
    title: 'AI Chat Agents',
    description:
      'Transform how you engage with customers and streamline operations using smart AI Chat Agents built just for you.',
    gradient: 'from-amber-500 to-orange-500',
    details: {
      features: [
        '24/7 customer support',
        'Multi-language support',
        'Custom knowledge base',
        'Seamless integration'
      ],
      benefits: [
        'Reduce response time',
        'Increase customer satisfaction',
        'Lower operational costs',
        'Scale support effortlessly'
      ],
      useCase:
        'Perfect for businesses looking to automate customer support and engagement while maintaining a personal touch.'
    }
  },
  {
    icon: Mic,
    title: 'AI Voice Agents',
    description:
      'Enhance customer experiences with conversational AI Voice Agents that handle calls like a pro.',
    gradient: 'from-blue-500 to-indigo-500',
    featured: true,
    details: {
      features: [
        'Natural voice interaction',
        'Real-time responses',
        'Custom voice & personality',
        'Call analytics'
      ],
      benefits: [
        '24/7 availability',
        'Consistent service quality',
        'Reduced wait times',
        'Scalable solution'
      ],
      useCase:
        'Ideal for businesses needing to handle high call volumes while maintaining quality and consistency.'
    }
  },
  {
    icon: LayoutDashboard,
    title: 'CRM Development',
    description:
      'Say goodbye to generic CRMs — let us build one perfectly designed for your needs.',
    gradient: 'from-purple-500 to-pink-500',
    details: {
      features: [
        'Custom workflows',
        'Automated reporting',
        'Integration capabilities',
        'Mobile accessibility'
      ],
      benefits: [
        'Improved efficiency',
        'Better data insights',
        'Enhanced collaboration',
        'Streamlined processes'
      ],
      useCase:
        'For businesses that need a CRM solution tailored to their unique processes and requirements.'
    }
  },
  {
    icon: Code2,
    title: 'Custom SaaS Solutions',
    description:
      'Bring your vision to life with custom-built software, tailored precisely to your needs.',
    gradient: 'from-green-500 to-emerald-500',
    details: {
      features: [
        'Scalable architecture',
        'Custom features',
        'API integration',
        'Security focused'
      ],
      benefits: [
        'Unique solution',
        'Complete control',
        'Future-proof design',
        'Competitive advantage'
      ],
      useCase:
        'Perfect for businesses needing specialized software solutions that off-the-shelf products can\'t provide.'
    }
  }
];
