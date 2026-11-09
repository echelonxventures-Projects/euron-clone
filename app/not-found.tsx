import Link from "next/link";
import PageShell from "@/components/PageShell";
import { Container, buttonClass } from "@/components/ui";

export default function NotFound() {
  return (
    <PageShell>
      <Container className="py-24 text-center">
        <p className="font-display text-7xl font-extrabold text-gradient">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>
        <p className="mb-8 mt-2 text-muted">The page you&apos;re looking for doesn&apos;t exist or was moved.</p>
        <Link href="/" className={buttonClass("primary")}>Back home</Link>
      </Container>
    </PageShell>
  );
}
