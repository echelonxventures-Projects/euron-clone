import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import bcrypt from "bcryptjs";
import * as schema from "../lib/db/schema";

const db = drizzle(createClient({ url: process.env.DATABASE_URL ?? "file:local.db", authToken: process.env.DATABASE_AUTH_TOKEN }), { schema });

const COURSES: (typeof schema.courses.$inferInsert)[] = [
  { slug: "generative-ai-with-llms", title: "Generative AI with LLMs", category: "ai", level: "Intermediate", hours: 42, modules: 21, icon: "🤖", gradient: "linear-gradient(135deg,#0e99ad,#2563eb)", description: "Understand transformers, fine-tuning, embeddings and retrieval, then ship production LLM apps end to end." },
  { slug: "agentic-ai-multi-agent-systems", title: "Agentic AI & Multi-Agent Systems", category: "ai", level: "Advanced", hours: 36, modules: 16, icon: "🧠", gradient: "linear-gradient(135deg,#7c3aed,#ec4899)", description: "Design tool-using agents, planning loops and multi-agent orchestration with evaluation and guardrails." },
  { slug: "prompt-engineering-bootcamp", title: "Prompt Engineering Bootcamp", category: "ai", level: "Beginner", hours: 12, modules: 8, icon: "✨", gradient: "linear-gradient(135deg,#f59e0b,#ef4444)", isFree: true, description: "Practical prompting patterns, structured outputs and evaluation for everyday AI work." },
  { slug: "data-science-masters", title: "Data Science Masters", category: "data", level: "Beginner", hours: 120, modules: 40, icon: "📊", gradient: "linear-gradient(135deg,#0ea5e9,#22c55e)", description: "Python, statistics, visualization and machine learning — a complete path from zero to job-ready." },
  { slug: "machine-learning-in-practice", title: "Machine Learning in Practice", category: "data", level: "Intermediate", hours: 64, modules: 24, icon: "📈", gradient: "linear-gradient(135deg,#0b7d8d,#0ea5e9)", description: "Feature engineering, model selection and tuning on real datasets, with a focus on what works in industry." },
  { slug: "sql-analytics-for-business", title: "SQL & Analytics for Business", category: "data", level: "Beginner", hours: 20, modules: 10, icon: "🗃️", gradient: "linear-gradient(135deg,#334155,#0e99ad)", isFree: true, description: "Write confident SQL, build metrics and answer business questions with data." },
  { slug: "full-stack-web-development", title: "Full-Stack Web Development", category: "dev", level: "Beginner", hours: 90, modules: 32, icon: "💻", gradient: "linear-gradient(135deg,#2563eb,#7c3aed)", description: "HTML to React to databases and deployment — build and launch complete web applications." },
  { slug: "dsa-in-python", title: "DSA in Python", category: "dev", level: "Intermediate", hours: 48, modules: 18, icon: "🧩", gradient: "linear-gradient(135deg,#16a34a,#0e99ad)", description: "Master data structures and algorithms with hundreds of interview-style problems." },
  { slug: "system-design-essentials", title: "System Design Essentials", category: "dev", level: "Advanced", hours: 30, modules: 12, icon: "🏗️", gradient: "linear-gradient(135deg,#0b1220,#2563eb)", description: "Scalability, caching, queues and databases — design systems the way senior engineers do." },
  { slug: "mlops-model-deployment", title: "MLOps & Model Deployment", category: "cloud", level: "Advanced", hours: 40, modules: 15, icon: "🚀", gradient: "linear-gradient(135deg,#ec4899,#f59e0b)", description: "Package, deploy, monitor and retrain models with CI/CD pipelines and cloud tooling." },
  { slug: "aws-cloud-practitioner", title: "AWS Cloud Practitioner", category: "cloud", level: "Beginner", hours: 24, modules: 11, icon: "☁️", gradient: "linear-gradient(135deg,#f97316,#fbbf24)", description: "Core cloud concepts and services, with hands-on labs to prepare for certification." },
  { slug: "docker-and-kubernetes", title: "Docker & Kubernetes", category: "cloud", level: "Intermediate", hours: 28, modules: 12, icon: "🐳", gradient: "linear-gradient(135deg,#0284c7,#0e99ad)", description: "Containerize applications and run them reliably at scale on Kubernetes." },
];

const PROJECTS: (typeof schema.projects.$inferInsert)[] = [
  { slug: "rag-document-chatbot", title: "RAG Document Chatbot", stack: "LangChain · Vector DB · LLMs", difficulty: "Advanced", icon: "💬" },
  { slug: "resume-screening-nlp", title: "Resume Screening with NLP", stack: "Python · spaCy · FastAPI", difficulty: "Intermediate", icon: "📑" },
  { slug: "realtime-object-detection", title: "Real-time Object Detection", stack: "PyTorch · YOLO · OpenCV", difficulty: "Advanced", icon: "👁️" },
  { slug: "sales-forecasting-dashboard", title: "Sales Forecasting Dashboard", stack: "Pandas · Prophet · Streamlit", difficulty: "Beginner", icon: "📉" },
];

async function main() {
  await db.insert(schema.courses).values(COURSES).onConflictDoNothing();
  await db.insert(schema.projects).values(PROJECTS).onConflictDoNothing();

  const email = process.env.ADMIN_EMAIL ?? "admin@euron.local";
  const password = process.env.ADMIN_PASSWORD ?? "admin12345";
  await db
    .insert(schema.users)
    .values({ name: "Admin", email, role: "admin", passwordHash: await bcrypt.hash(password, 12) })
    .onConflictDoNothing();

  console.log(`Seeded ${COURSES.length} courses, ${PROJECTS.length} projects. Admin: ${email} / ${password}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
