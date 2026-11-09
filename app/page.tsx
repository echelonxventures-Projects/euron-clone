import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CourseExplorer from "@/components/CourseExplorer";
import Projects from "@/components/Projects";
import CareerTools from "@/components/CareerTools";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import { getSession } from "@/lib/auth";
import { getActiveSubscription, getPlatformStats, listCourses, listProjects } from "@/lib/queries";

export default async function Home() {
  const session = await getSession();
  const [stats, courses, projects, sub] = await Promise.all([
    getPlatformStats(),
    listCourses(),
    listProjects(),
    session ? getActiveSubscription(session.userId) : null,
  ]);

  return (
    <>
      <Navbar />
      <main>
        <Hero stats={stats} />
        <CourseExplorer courses={courses} />
        <Projects projects={projects} />
        <CareerTools />
        <HowItWorks />
        <Pricing activePlan={!!sub} />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
