// Everything the page renders lives here — edit this file to make the portfolio yours.

export const profile = {
  name: "Keval Dhol",
  initials: "KD.",
  role: "Full-stack Engineer",
  location: "India · Remote",
  timeZone: "Asia/Kolkata",
  email: "hello@kevaldhol.com",
  available: true,
  headline: ["Engineering", "calm software", "for loud problems."],
  intro:
    "I design and build the systems behind busy operations, end to end — from the database schema to the last pixel of the interface.",
  about:
    "I'm a full-stack engineer working mostly in TypeScript. I've built Twilio Flex contact centres that take a customer from first call to a funded car-finance deal, a distributed operations platform for a refurbished-electronics business, and Sitecore front ends that let airline and banking teams publish without waiting on developers. I like the unglamorous parts: data models that age well, integrations that don't fall over, and interfaces that feel obvious to the people who use them all day.",
  socials: [
    { label: "GitHub", href: "https://github.com/kevaldhol24" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/keval-d-5b244316a/" },
  ],
};

/** Counts taken from the projects below. */
export const stats: { value: number; suffix: string; label: string; decimals?: number }[] = [
  { value: 5, suffix: "", label: "Platforms delivered" },
  { value: 10, suffix: "", label: "Third-party integrations" },
  { value: 5, suffix: "", label: "Industries" },
  { value: 2, suffix: "", label: "Contact centres built" },
];

export const skills = [
  "TypeScript",
  "React",
  "React Router / Remix",
  "Next.js",
  "Angular",
  "Tailwind CSS",
  "Three.js",
  "Node.js",
  "NestJS",
  "Express",
  "NATS",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Prisma",
  "Vendure",
  "Docker",
  "System Design",
  "Twilio Flex",
  "Sitecore",
  "HubSpot",
  "Shopify",
];

export const services = [
  {
    title: "Contact-centre platforms",
    body: "Twilio Flex call centres wired into your CRM and back office, so agents handle the whole customer journey from one screen.",
  },
  {
    title: "Operations & commerce systems",
    body: "Distributed back ends that keep inventory, orders and accounting in sync across Shopify, Amazon, Zoho and the rest.",
  },
  {
    title: "CMS-driven front ends",
    body: "Sitecore and Next.js sites your content team can run on its own, without a developer for every change.",
  },
];

export type Project = {
  title: string;
  /** Optional until confirmed. */
  year?: string;
  kind: string;
  summary: string;
  tags: string[];
  href?: string;
  /** Two colours for the generative cover. */
  palette: [string, string];
};

export const projects: Project[] = [
  {
    title: "Cykero",
    kind: "Circular e-commerce",
    summary:
      "A distributed platform behind a refurbished-electronics business: internal and customer-facing apps for inventory, accounting, returns and operations, kept in sync with Zoho, Shopify, Amazon, Linnworks and Refurbed.",
    tags: ["NestJS", "React Router", "Next.js", "Angular", "PostgreSQL", "NATS", "Vendure"],
    palette: ["#c6ff3d", "#00a37a"],
  },
  {
    title: "Car Finance 247",
    kind: "Contact centre",
    summary:
      "A Twilio Flex contact centre that runs the whole car-finance journey, from first lead through car sale and loan to payment collection, so agents work every stage from one place.",
    tags: ["Twilio Flex", "React", "TypeScript", "Redis"],
    palette: ["#ff6b3d", "#7c5cff"],
  },
  {
    title: "Fresha",
    kind: "Contact centre",
    summary:
      "A Twilio-based customer support centre for a salon and spa booking marketplace, integrated with the company's existing HubSpot so agents see the customer and their bookings on every call.",
    tags: ["Twilio Flex", "React", "Express", "TypeScript", "Redis", "HubSpot"],
    palette: ["#ff3d9a", "#ffb03d"],
  },
  {
    title: "Royal Jordanian",
    kind: "Aviation",
    summary:
      "A Sitecore-configurable front end that lets the airline's content team manage pages and policies without developers, plus a booking engine integrated with Amadeus and a miles-and-points system through Points.com.",
    tags: ["Sitecore", "JavaScript", "jQuery", "Amadeus", "Points.com"],
    palette: ["#3dd6ff", "#2a3bff"],
  },
  {
    title: "Bank AlJazira",
    kind: "Banking",
    summary:
      "A Sitecore-configurable brochure site that the bank's team manages end to end, built on Next.js and TypeScript.",
    tags: ["Sitecore", "Next.js", "TypeScript"],
    palette: ["#7c5cff", "#3dd6ff"],
  },
];

export const experience = [
  {
    period: "2024 — Now",
    role: "Senior Software Engineer",
    company: "Independent",
    body: "Leading platform builds for commerce and logistics teams — architecture, delivery and mentoring.",
  },
  {
    period: "2021 — 2024",
    role: "Full-stack Engineer",
    company: "Product studio",
    body: "Shipped a dozen client products, owning everything from API design to the design system.",
  },
  {
    period: "2018 — 2021",
    role: "Software Engineer",
    company: "SaaS start-up",
    body: "Grew from first front-end hire to owning the billing and reporting services.",
  },
];

export const sections = [
  { id: "top", label: "Index" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/* ---------------------------------------------------------------------------
   Terminal page (/terminal)
   --------------------------------------------------------------------------- */

/** `figlet -f "ANSI Shadow"` of the name, shown under `whoami`. */
export const asciiName = String.raw`██╗  ██╗███████╗██╗   ██╗ █████╗ ██╗
██║ ██╔╝██╔════╝██║   ██║██╔══██╗██║
█████╔╝ █████╗  ██║   ██║███████║██║
██╔═██╗ ██╔══╝  ╚██╗ ██╔╝██╔══██║██║
██║  ██╗███████╗ ╚████╔╝ ██║  ██║███████╗
╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝  ╚═╝╚══════╝`;

/** The same skills as above, grouped for `tree ~/skills`. */
export const skillGroups = [
  { name: "languages", items: ["TypeScript", "JavaScript"] },
  {
    name: "frontend",
    items: ["React", "React Router / Remix", "Next.js", "Angular", "Tailwind CSS", "Three.js"],
  },
  { name: "backend", items: ["Node.js", "NestJS", "Express", "NATS", "Vendure"] },
  { name: "data", items: ["PostgreSQL", "MongoDB", "Redis", "Prisma"] },
  { name: "infra", items: ["Docker", "System Design"] },
  { name: "platforms", items: ["Twilio Flex", "Sitecore", "HubSpot", "Shopify", "Zoho"] },
];

export type Education = {
  degree: string;
  school: string;
  /** e.g. "2019 — 2023"; leave empty until confirmed. */
  period?: string;
  focus?: string[];
};

export const education: Education[] = [
  {
    degree: "B.E. Computer Engineering",
    school: "Government Engineering College, Bhavnagar",
  },
];

export const certifications: { name: string }[] = [];
