export type CourseCategory = "ai" | "data" | "dev" | "cloud";

export const CATEGORIES: { id: CourseCategory | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI & GenAI" },
  { id: "data", label: "Data Science" },
  { id: "dev", label: "Development" },
  { id: "cloud", label: "Cloud & DevOps" },
];

export const CATEGORY_LABEL: Record<CourseCategory, string> = {
  ai: "AI & GenAI",
  data: "Data Science",
  dev: "Development",
  cloud: "Cloud & DevOps",
};

export const CAREER_FEATURES = [
  { icon: "📄", title: "AI Resume Builder", text: "Generate ATS-friendly resumes, get a score, and tailor them to any job description in seconds." },
  { icon: "🎯", title: "Smart Job Matching", text: "We match your skills and completed projects with open roles, and tell you what's missing." },
  { icon: "🎙️", title: "Mock Interviews", text: "Practice technical and HR rounds with an AI interviewer and get detailed, actionable feedback." },
  { icon: "🧑‍🏫", title: "Live Mentorship", text: "Weekly live sessions and doubt-clearing with industry mentors across every track." },
  { icon: "🏆", title: "Certificates", text: "Verifiable certificates for each course and project you complete — share them anywhere." },
  { icon: "👥", title: "Community", text: "Study groups, hackathons and peer reviews with thousands of learners worldwide." },
];

export const STEPS = [
  { title: "Subscribe once", text: "Unlock every course, project and career tool." },
  { title: "Learn by doing", text: "Follow a track and build projects as you go." },
  { title: "Get job-ready", text: "Polish your resume and ace mock interviews." },
  { title: "Get hired", text: "Apply to matched roles with confidence." },
];

export type Plan = {
  name: string;
  tagline: string;
  price: { monthly: number; yearly: number } | string;
  features: string[];
  cta: string;
  featured?: boolean;
};

export const PLANS: Plan[] = [
  { name: "Starter", tagline: "Try the platform", price: "Free", features: ["5 free courses", "2 guided projects", "Community access"], cta: "Sign up free" },
  {
    name: "Euron One",
    tagline: "The full subscription",
    price: { monthly: 999, yearly: 7199 },
    features: [
      "All 75+ courses & live classes",
      "All 96+ AI-powered projects",
      "Resume builder, job matching & mock interviews",
      "Certificates & 24/7 doubt support",
    ],
    cta: "Get Euron One",
    featured: true,
  },
  { name: "Teams", tagline: "For colleges & companies", price: "Custom", features: ["Everything in Euron One", "Admin dashboard & analytics", "Dedicated success manager"], cta: "Contact sales" },
];

// Placeholder testimonials — replace with real, consented quotes before going live.
export const TESTIMONIALS = [
  { initial: "A", track: "Data Science track", quote: "Having courses, projects and interview practice in one place kept me consistent. I built three portfolio projects in two months." },
  { initial: "R", track: "GenAI track", quote: "The AI feedback on my project code was like having a senior engineer reviewing my pull requests every day." },
  { initial: "S", track: "Web Development track", quote: "Mock interviews showed me exactly where I was weak. The resume builder tailored my CV for every application." },
];

export const FAQS = [
  { q: "What does one subscription include?", a: "Every course, live class, AI-powered project and career tool on the platform — no add-ons or per-course fees." },
  { q: "Are the courses beginner-friendly?", a: "Yes. Each track starts from fundamentals and progresses to advanced, industry-level topics." },
  { q: "Do I get a certificate?", a: "You receive a verifiable certificate for every course and project you complete." },
  { q: "Can I cancel anytime?", a: "Absolutely. Cancel from your account settings and keep access until the end of your billing period." },
  { q: "Is there placement assistance?", a: "Job matching, resume tools and mock interviews are included, along with referrals to partner companies where available." },
];

export const NAV_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/#projects", label: "Projects" },
  { href: "/#career", label: "Career Tools" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
];

// Fictional company names used as placeholders.
export const LOGOS = ["Northwind", "Globex", "Initech", "Umbrella", "Hooli", "Stark Labs"];
