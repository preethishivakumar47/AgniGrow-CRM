export interface DemoLead {
  id: string;
  firstName: string;
  lastName?: string | null;
  phone: string;
  email?: string | null;
  companyName?: string | null;
  service: string;
  budget: string;
  timeline: string;
  notes?: string | null;
  status: string;
  source: string;
  createdAt: string;
  assignedUser?: { name: string } | null;
  activities?: Array<{
    id: string;
    type: string;
    content: string;
    createdAt: string;
  }>;
}

export interface DemoDeal {
  id: string;
  title: string;
  dealValue: number;
  service: string;
  stage: string;
  probability: number;
  account: { name: string };
  contact: { firstName: string; lastName?: string | null; phone: string };
  assignedUser: { name: string };
}

export interface DemoTask {
  id: string;
  title: string;
  type: string;
  dueDate: string;
  priority: string;
  status: string;
  lead?: { firstName: string; lastName?: string | null; phone: string } | null;
}

export const DEMO_LEADS: DemoLead[] = [
  {
    id: "lead-001",
    firstName: "Muthu",
    lastName: "Kumar",
    phone: "+919876543210",
    email: "muthu@amburleather.com",
    companyName: "Ambur Fine Leathers",
    service: "WEBSITE",
    budget: "TIER_60K_120K",
    timeline: "WEEKS_2_TO_4",
    notes: "Requires custom export catalog portal with direct WhatsApp quotation desk for European clients.",
    status: "NEW",
    source: "WEBSITE_SCOPER",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    assignedUser: { name: "Arish Srinivasan" },
    activities: [
      {
        id: "act-1",
        type: "SYSTEM_EVENT",
        content: "Lead captured via website scoper with budget tier ₹60k – ₹1.2L.",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
  },
  {
    id: "lead-002",
    firstName: "Syed",
    lastName: "Ibrahim",
    phone: "+919443211223",
    email: "syed@vnbspices.com",
    companyName: "Vaniyambadi Spices Exporters",
    service: "WHATSAPP_BOT",
    budget: "TIER_30K_60K",
    timeline: "UNDER_2_WEEKS",
    notes: "Needs automated WhatsApp order and quote generator for regional traders.",
    status: "CONTACTED",
    source: "WHATSAPP_DIRECT",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    assignedUser: { name: "Karthik Sales Rep" },
    activities: [
      {
        id: "act-2",
        type: "CALL_LOG",
        content: "Discovery call conducted. Client requested demo quotation template.",
        createdAt: new Date(Date.now() - 43200000).toISOString(),
      },
    ],
  },
  {
    id: "lead-003",
    firstName: "Kavitha",
    lastName: "Sundaram",
    phone: "+919789012345",
    email: "kavitha@texstyle.in",
    companyName: "Tirupur Global Weaves",
    service: "ECOMMERCE",
    budget: "TIER_120K_PLUS",
    timeline: "MONTHS_1_TO_2",
    notes: "B2B wholesale portal with customer tier pricing and GST invoice integration.",
    status: "QUALIFIED",
    source: "REFERRAL",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    assignedUser: { name: "Arish Srinivasan" },
    activities: [
      {
        id: "act-3",
        type: "NOTE",
        content: "Scope defined. Proposal drafted for ₹1,45,000.",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  },
  {
    id: "lead-004",
    firstName: "Dinesh",
    lastName: "Rajan",
    phone: "+919940123456",
    email: "dinesh@vellorefood.com",
    companyName: "Vellore Food Machinery",
    service: "BRANDING",
    budget: "TIER_15K_30K",
    timeline: "WEEKS_2_TO_4",
    notes: "Complete brand kit, product catalog pdf and logo redesign.",
    status: "PROPOSAL_SENT",
    source: "WEBSITE_SCOPER",
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    assignedUser: { name: "Karthik Sales Rep" },
    activities: [],
  },
];

export const DEMO_DEALS: DemoDeal[] = [
  {
    id: "deal-001",
    title: "Multilingual Leather Export Web Portal",
    dealValue: 85000,
    service: "WEBSITE",
    stage: "DISCOVERY",
    probability: 30,
    account: { name: "Ranipet Leather Works Pvt Ltd" },
    contact: { firstName: "Ramesh", lastName: "Krishnan", phone: "+919842155678" },
    assignedUser: { name: "Arish Srinivasan" },
  },
  {
    id: "deal-002",
    title: "B2B Agro Commodities Commerce Store",
    dealValue: 125000,
    service: "ECOMMERCE",
    stage: "PROPOSAL_DRAFTED",
    probability: 40,
    account: { name: "Vaniyambadi Agro Traders" },
    contact: { firstName: "Farhan", lastName: "Ahmed", phone: "+919443299881" },
    assignedUser: { name: "Karthik Sales Rep" },
  },
  {
    id: "deal-003",
    title: "Automated WhatsApp Quotation & Support Bot",
    dealValue: 48000,
    service: "WHATSAPP_BOT",
    stage: "PROPOSAL_SENT",
    probability: 60,
    account: { name: "Ambur Tanners Association" },
    contact: { firstName: "Sadiq", lastName: "Pasha", phone: "+919842345678" },
    assignedUser: { name: "Arish Srinivasan" },
  },
  {
    id: "deal-004",
    title: "Cloud POS & Inventory Integration",
    dealValue: 95000,
    service: "ERP_POS",
    stage: "NEGOTIATION",
    probability: 80,
    account: { name: "Chennai Footwear Retail Chain" },
    contact: { firstName: "Vijay", lastName: "Anand", phone: "+919884123456" },
    assignedUser: { name: "Arish Srinivasan" },
  },
  {
    id: "deal-005",
    title: "Global Brand Identity Kit & Micro-Site",
    dealValue: 65000,
    service: "BRANDING",
    stage: "CLOSED_WON",
    probability: 100,
    account: { name: "Coromandel Spice Exporters" },
    contact: { firstName: "Suresh", lastName: "Narayanan", phone: "+919789654321" },
    assignedUser: { name: "Karthik Sales Rep" },
  },
  {
    id: "deal-006",
    title: "Digital Event Microsite & Badge Registration",
    dealValue: 35000,
    service: "EVENT_MICROSITE",
    stage: "CLOSED_WON",
    probability: 100,
    account: { name: "Tamil Nadu Leather Summit 2026" },
    contact: { firstName: "Prakash", lastName: "Vel", phone: "+919840112233" },
    assignedUser: { name: "Arish Srinivasan" },
  },
];

export const DEMO_TASKS: DemoTask[] = [
  {
    id: "task-001",
    title: "Follow up with Ramesh on leather export portal contract advance",
    type: "CALL",
    dueDate: new Date(Date.now() - 3600000 * 4).toISOString(), // overdue
    priority: "URGENT",
    status: "PENDING",
    lead: { firstName: "Ramesh", phone: "+919842155678" },
  },
  {
    id: "task-002",
    title: "Send WhatsApp bot architecture flow diagram to Farhan",
    type: "WHATSAPP_FOLLOW_UP",
    dueDate: new Date().toISOString(),
    priority: "HIGH",
    status: "PENDING",
    lead: { firstName: "Farhan", phone: "+919443299881" },
  },
  {
    id: "task-003",
    title: "Deliver revised B2B store proposal to Kavitha Sundaram",
    type: "SEND_PROPOSAL",
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    priority: "MEDIUM",
    status: "PENDING",
    lead: { firstName: "Kavitha", phone: "+919789012345" },
  },
];

