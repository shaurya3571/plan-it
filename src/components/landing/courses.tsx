import { SectionHead } from "@/components/landing/section-head";
import { CourseCard } from "@/components/course-card";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { coursesHead } from "@/content/landing";
import { popularCourses } from "@/content/courses";

export function Courses() {
  return (
    <section
      id="courses"
      aria-labelledby="courses-title"
      className="scroll-mt-24 px-6 py-[110px]"
    >
      <div className="mx-auto max-w-[1200px]">
        <SectionHead {...coursesHead} id="courses-title" />
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularCourses.map((course) => (
            <RevealItem key={course.slug} className="flex">
              <CourseCard course={course} className="w-full" />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
