/**
 * Per-study SEO metadata for /case-studies/<slug>.
 *
 * Held here rather than imported from CaseStudies/data.ts so the case-study
 * records stay out of the main bundle — Head is eager, that data is not.
 * tone.check.ts asserts every slug in data.ts has an entry here with a
 * matching title, so the two cannot drift apart silently.
 */
export const CASE_STUDY_META: Record<string, { title: string; description: string }> = {
  'task-automation-google-calendar': {
    title: 'Task Automation via Google Calendar API',
    description:
      'Developed a Telegram bot on the Google Calendar API so the team can pull an event in one tap instead of searching the calendar by hand.',
  },
  'ai-chat-agent-barber': {
    title: 'AI Chat Agent for a Home-Based Barber',
    description:
      'Designed an AI-powered chat agent that automates appointment scheduling and customer interactions via Instagram and WhatsApp for a home-based barber.',
  },
  'ai-sdr-call-agent': {
    title: 'AI SDR Call Agent for a Leads Manager',
    description:
      'Created an AI Sales Development Representative (SDR) call agent to manage initial outreach, qualify leads, and transfer high-potential prospects to human sales reps.',
  },
  'custom-saas-logistics': {
    title: 'Custom SaaS for a Logistics Firm',
    description:
      'Built a custom SaaS platform for route optimization, real-time tracking, and automated invoicing, tailored to improve operational efficiency and scalability for a logistics company.',
  },
  'crm-accounting-firm': {
    title: 'CRM Build for an Accounting Firm',
    description:
      'Built a CRM on GoHighLevel for an accounting firm so client records, tasks, and messages live in one place.',
  },
};
