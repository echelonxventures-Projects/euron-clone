import Link from "next/link";
import Reveal from "./Reveal";
import { Container, buttonClass } from "./ui";

export default function Cta() {
  return (
    <section className="pb-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-linear-135 from-primary to-accent px-8 py-16 text-center text-sky-100">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0,rgba(255,255,255,.25),transparent_50%)]" />
            <div className="relative">
              <h2 className="mb-3 text-[clamp(1.8rem,3.6vw,2.8rem)] font-bold text-white">Ready to level up your career?</h2>
              <p className="mb-6">Join thousands of learners building real skills with one simple subscription.</p>
              <Link href="/signup" className={buttonClass("light", "lg")}>Start your journey →</Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
