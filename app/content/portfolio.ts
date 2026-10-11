// Everything the page renders lives here — edit this file to make the portfolio yours.

export const profile = {
  name: "Keval",
  initials: "K.",
  role: "Full-stack Engineer",
  location: "Remote · Europe",
  timeZone: "Europe/Berlin",
  email: "hello@example.com",
  available: true,
  headline: ["Engineering", "calm software", "for loud problems."],
  intro:
    "I design and build fast, resilient products end to end — from the database schema to the last pixel of the interface.",
  about:
    "I'm a senior engineer who likes the unglamorous parts: data models that age well, interfaces that feel obvious, and systems that keep working at three in the morning. I've shipped platforms for logistics, finance and commerce teams, and I care as much about the people using the software as the code behind it.",
  socials: [
    { label: "GitHub", href: "https://github.com/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "X / Twitter", href: "https://x.com/" },
    { label: "Read.cv", href: "https://read.cv/" },
  ],
};

export const stats = [
  { value: 8, suffix: "+", label: "Years shipping" },
  { value: 40, suffix: "+", label: "Products launched" },
  { value: 12, suffix: "", label: "Teams supported" },
  { value: 99.9, suffix: "%", label: "Uptime obsessed", decimals: 1 },
];

export const skills = [
  "TypeScript",
  "React",
  "React Router",
  "Node.js",
  "NestJS",
  "Angular",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "NATS",
  "Docker",
  "Three.js",
  "Tailwind CSS",
  "System Design",
];

export const services = [
  {
    title: "Product engineering",
    body: "Taking ideas from a napkin sketch to a production app, with the boring reliability baked in from day one.",
  },
  {
    title: "Platform & APIs",
    body: "Event-driven back ends, clean domain boundaries, and integrations that don't fall over when a vendor does.",
  },
  {
    title: "Interfaces & motion",
    body: "Accessible, fast front ends with just enough motion to make them feel alive — never enough to get in the way.",
  },
];

export type Project = {
  title: string;
  year: string;
  kind: string;
  summary: string;
  tags: string[];
  href?: string;
  /** Two colours for the generative cover. */
  palette: [string, string];
};

export const projects: Project[] = [
  {
    title: "Returnflow",
    year: "2026",
    kind: "Platform",
    summary:
      "An end-to-end returns platform: customer self-service, warehouse inspection queues and automated credit notes.",
    tags: ["NestJS", "React Router", "NATS"],
    palette: ["#ff6b3d", "#7c5cff"],
  },
  {
    title: "Ledgerline",
    year: "2025",
    kind: "Fintech",
    summary:
      "Real-time cash-flow analytics across two legal entities, reconciling thousands of documents a day.",
    tags: ["TypeScript", "MongoDB", "Charts"],
    palette: ["#3dd6ff", "#2a3bff"],
  },
  {
    title: "Stockroom",
    year: "2025",
    kind: "Operations",
    summary:
      "Inventory and inter-company transfers with saga-based compensation, so no unit is ever lost in transit.",
    tags: ["CQRS", "BullMQ", "Angular"],
    palette: ["#c6ff3d", "#00a37a"],
  },
  {
    title: "Orbit",
    year: "2024",
    kind: "Creative",
    summary:
      "A WebGL product configurator that renders a full device lineup in the browser at a smooth 60fps.",
    tags: ["Three.js", "GLSL", "Motion"],
    palette: ["#ff3d9a", "#ffb03d"],
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
