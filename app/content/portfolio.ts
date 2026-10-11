// Everything the page renders lives here — edit this file to make the portfolio yours.

export const profile = {
  name: "Keval Dhol",
  role: "Full-stack Engineer",
  location: "Ahmedabad, India · Remote",
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

/** Years from the experience list (Nov 2021 onward); the rest are counts from the projects. */
export const stats: { value: number; suffix: string; label: string; decimals?: number }[] = [
  { value: 5, suffix: "", label: "Years building software" },
  { value: 5, suffix: "", label: "Platforms delivered" },
  { value: 10, suffix: "", label: "Third-party integrations" },
  { value: 5, suffix: "", label: "Industries" },
];

export type Project = {
  title: string;
  /** Optional until confirmed. */
  year?: string;
  kind: string;
  summary: string;
  tags: string[];
  href?: string;
};

export const projects: Project[] = [
  {
    title: "Cykero",
    kind: "Circular e-commerce",
    summary:
      "A distributed platform behind a refurbished-electronics business: internal and customer-facing apps for inventory, accounting, returns and operations, kept in sync with Zoho, Shopify, Amazon, Linnworks and Refurbed.",
    tags: ["NestJS", "React Router", "Next.js", "Angular", "PostgreSQL", "NATS", "Vendure"],
  },
  {
    title: "Car Finance 247",
    kind: "Contact centre",
    summary:
      "A Twilio Flex contact centre that runs the whole car-finance journey, from first lead through car sale and loan to payment collection, so agents work every stage from one place.",
    tags: ["Twilio Flex", "React", "TypeScript", "Redis"],
  },
  {
    title: "Fresha",
    kind: "Contact centre",
    summary:
      "A Twilio-based customer support centre for a salon and spa booking marketplace, integrated with the company's existing HubSpot so agents see the customer and their bookings on every call.",
    tags: ["Twilio Flex", "React", "Express", "TypeScript", "Redis", "HubSpot"],
  },
  {
    title: "Royal Jordanian",
    kind: "Aviation",
    summary:
      "A Sitecore-configurable front end that lets the airline's content team manage pages and policies without developers, plus a booking engine integrated with Amadeus and a miles-and-points system through Points.com.",
    tags: ["Sitecore", "JavaScript", "jQuery", "Amadeus", "Points.com"],
  },
  {
    title: "Bank AlJazira",
    kind: "Banking",
    summary:
      "A Sitecore-configurable brochure site that the bank's team manages end to end, built on Next.js and TypeScript.",
    tags: ["Sitecore", "Next.js", "TypeScript"],
  },
];

export const experience = [
  {
    period: "Jul 2025 — Now",
    role: "Senior Software Engineer",
    company: "TatvaSoft",
    body: "Leading delivery on client platforms: talking to clients, shaping requirements, building features and reviewing the team's code through to release.",
  },
  {
    period: "Jul 2023 — Jun 2025",
    role: "Software Engineer",
    company: "TatvaSoft",
    body: "Turned requirements into shipped features across client projects, reviewed pull requests and kept the documentation current.",
  },
  {
    period: "Jul 2022 — Jun 2023",
    role: "Assistant Software Engineer",
    company: "TatvaSoft",
    body: "Built features with React and PostgreSQL, wrote documentation and tested releases.",
  },
  {
    period: "Nov 2021 — Jun 2022",
    role: "Internship Trainee",
    company: "TatvaSoft",
    body: "Learned the craft on React and Node.js, working on real client code from the first month.",
  },
];

export const sections = [
  { id: "top", label: "Index" },
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
] as const;

/** `figlet -f "ANSI Shadow"` of the name, shown under `whoami`. */
export const asciiName = String.raw`██╗  ██╗███████╗██╗   ██╗ █████╗ ██╗
██║ ██╔╝██╔════╝██║   ██║██╔══██╗██║
█████╔╝ █████╗  ██║   ██║███████║██║
██╔═██╗ ██╔══╝  ╚██╗ ██╔╝██╔══██║██║
██║  ██╗███████╗ ╚████╔╝ ██║  ██║███████╗
╚═╝  ╚═╝╚══════╝  ╚═══╝  ╚═╝  ╚═╝╚══════╝`;

/** Rendered as `tree ~/skills`. */
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
