// ---------- Data ----------
const COURSES = [
  { title: "Generative AI with LLMs", cat: "ai", level: "Intermediate", hours: 42, icon: "🤖", bg: "linear-gradient(135deg,#0e99ad,#2563eb)" },
  { title: "Agentic AI & Multi-Agent Systems", cat: "ai", level: "Advanced", hours: 36, icon: "🧠", bg: "linear-gradient(135deg,#7c3aed,#ec4899)" },
  { title: "Prompt Engineering Bootcamp", cat: "ai", level: "Beginner", hours: 12, icon: "✨", bg: "linear-gradient(135deg,#f59e0b,#ef4444)" },
  { title: "Data Science Masters", cat: "data", level: "Beginner", hours: 120, icon: "📊", bg: "linear-gradient(135deg,#0ea5e9,#22c55e)" },
  { title: "Machine Learning in Practice", cat: "data", level: "Intermediate", hours: 64, icon: "📈", bg: "linear-gradient(135deg,#0b7d8d,#0ea5e9)" },
  { title: "SQL & Analytics for Business", cat: "data", level: "Beginner", hours: 20, icon: "🗃️", bg: "linear-gradient(135deg,#334155,#0e99ad)" },
  { title: "Full-Stack Web Development", cat: "dev", level: "Beginner", hours: 90, icon: "💻", bg: "linear-gradient(135deg,#2563eb,#7c3aed)" },
  { title: "DSA in Python", cat: "dev", level: "Intermediate", hours: 48, icon: "🧩", bg: "linear-gradient(135deg,#16a34a,#0e99ad)" },
  { title: "System Design Essentials", cat: "dev", level: "Advanced", hours: 30, icon: "🏗️", bg: "linear-gradient(135deg,#0b1220,#2563eb)" },
  { title: "MLOps & Model Deployment", cat: "cloud", level: "Advanced", hours: 40, icon: "🚀", bg: "linear-gradient(135deg,#ec4899,#f59e0b)" },
  { title: "AWS Cloud Practitioner", cat: "cloud", level: "Beginner", hours: 24, icon: "☁️", bg: "linear-gradient(135deg,#f97316,#fbbf24)" },
  { title: "Docker & Kubernetes", cat: "cloud", level: "Intermediate", hours: 28, icon: "🐳", bg: "linear-gradient(135deg,#0284c7,#0e99ad)" },
];

const PROJECTS = [
  { title: "RAG Document Chatbot", sub: "LangChain · Vector DB · LLMs", icon: "💬", bg: "#dff4f7", tag: ["Advanced", "tag--teal"] },
  { title: "Resume Screening with NLP", sub: "Python · spaCy · FastAPI", icon: "📑", bg: "#fff7ed", tag: ["Intermediate", "tag--amber"] },
  { title: "Real-time Object Detection", sub: "PyTorch · YOLO · OpenCV", icon: "👁️", bg: "#dce9f7", tag: ["Advanced", "tag--blue"] },
  { title: "Sales Forecasting Dashboard", sub: "Pandas · Prophet · Streamlit", icon: "📉", bg: "#fde7f3", tag: ["Beginner", "tag--pink"] },
];

const CAT_LABEL = { ai: "AI & GenAI", data: "Data Science", dev: "Development", cloud: "Cloud & DevOps" };

// ---------- Render courses ----------
const courseGrid = document.getElementById("courseGrid");
function renderCourses(filter = "all") {
  const list = filter === "all" ? COURSES : COURSES.filter(c => c.cat === filter);
  courseGrid.innerHTML = list.map((c, i) => `
    <article class="course" style="animation-delay:${i * 40}ms">
      <div class="course__thumb" style="background:${c.bg}">
        <span class="tag">${CAT_LABEL[c.cat]}</span>${c.icon}
      </div>
      <div class="course__body">
        <h3>${c.title}</h3>
        <div class="course__meta"><span>🎓 ${c.level}</span><span>⏱ ${c.hours} hrs</span></div>
      </div>
    </article>`).join("");
}
renderCourses();

document.getElementById("courseTabs").addEventListener("click", e => {
  const btn = e.target.closest(".tab");
  if (!btn) return;
  document.querySelectorAll("#courseTabs .tab").forEach(t => t.classList.toggle("is-active", t === btn));
  renderCourses(btn.dataset.filter);
});

// ---------- Render projects ----------
document.getElementById("projectStack").innerHTML = PROJECTS.map(p => `
  <div class="project">
    <div class="project__icon" style="background:${p.bg}">${p.icon}</div>
    <div><h3>${p.title}</h3><small>${p.sub}</small></div>
    <span class="tag ${p.tag[1]}">${p.tag[0]}</span>
  </div>`).join("");

// ---------- Nav ----------
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
window.addEventListener("scroll", () => nav.classList.toggle("is-scrolled", window.scrollY > 8), { passive: true });
navToggle.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", open);
});
navLinks.addEventListener("click", e => {
  if (e.target.closest("a")) {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

// ---------- Pricing toggle ----------
const priceOne = document.getElementById("priceOne");
const pricePer = document.getElementById("pricePer");
document.getElementById("billingToggle").addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;
  document.querySelectorAll("#billingToggle button").forEach(b => b.classList.toggle("is-active", b === btn));
  const yearly = btn.dataset.plan === "yearly";
  priceOne.textContent = Number(priceOne.dataset[yearly ? "yearly" : "monthly"]).toLocaleString("en-IN");
  pricePer.textContent = yearly ? "/year" : "/month";
});

// ---------- FAQ: one open at a time ----------
const faqItems = document.querySelectorAll("#faqList details");
faqItems.forEach(d => d.addEventListener("toggle", () => {
  if (d.open) faqItems.forEach(o => o !== d && (o.open = false));
}));

// ---------- Count-up stats ----------
function countUp(el) {
  const target = +el.dataset.count, dur = 1200, start = performance.now();
  const step = now => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    entry.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(entry.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// ---------- Newsletter ----------
document.getElementById("newsletter").addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("newsletterMsg").textContent = "Thanks! You're on the list. 🎉";
  e.target.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
