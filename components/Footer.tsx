import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import { Container, Logo } from "./ui";

const COLUMNS = [
  { title: "Platform", links: [["Courses", "/courses"], ["Projects", "/#projects"], ["Career Tools", "/#career"], ["Pricing", "/#pricing"]] },
  { title: "Company", links: [["About", "#"], ["Careers", "#"], ["Blog", "#"], ["Contact", "/contact"]] },
  { title: "Legal", links: [["Terms", "#"], ["Privacy", "#"], ["Refund policy", "#"]] },
];

export default function Footer() {
  return (
    <footer className="bg-ink pb-7 pt-[72px] text-slate-400">
      <Container className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="my-4 max-w-[340px]">One student, one subscription — courses, projects and career tools in a single platform.</p>
          <NewsletterForm />
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-base font-bold text-white">{col.title}</h4>
            {col.links.map(([label, href]) => (
              <Link key={label} href={href} className="block py-1 transition hover:text-teal-300">{label}</Link>
            ))}
          </div>
        ))}
      </Container>
      <Container className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink-3 pt-6">
        <small>© {new Date().getFullYear()} Euron clone — built for learning purposes.</small>
        <div className="flex gap-2">
          {[["LinkedIn", "in"], ["YouTube", "▶"], ["X", "𝕏"]].map(([label, icon]) => (
            <a key={label} href="#" aria-label={label} className="grid size-9 place-items-center rounded-[10px] bg-ink-2 font-bold text-slate-300 transition hover:bg-primary hover:text-white">
              {icon}
            </a>
          ))}
        </div>
      </Container>
    </footer>
  );
}
