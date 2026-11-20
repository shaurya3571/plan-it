import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Courses } from "@/components/landing/courses";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { FinalCta } from "@/components/landing/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Courses />
      <HowItWorks />
      <Testimonials />
      <FinalCta />
    </>
  );
}
