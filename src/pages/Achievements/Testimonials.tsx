import { Quote, Star } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";

/**
 * MOCK DATA
 * In a real app, this would be fetched via React Query from your Django DRF backend.
 */
const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Fatima Al-Sayed",
    role: "Parent of 10th Grader",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=100&h=100",
    content:
      "Enrolling my daughter at Sultan Zoy High School was the best decision we've made. The balance between academic rigor and moral development is exactly what we were looking for. The teachers genuinely care about student success.",
    rating: 5,
  },
  {
    id: 2,
    name: "Omar Zoy",
    role: "Alumni, Class of 2018",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100",
    content:
      "The science laboratories and the robotics club gave me the foundation I needed for my engineering degree. I still visit my physics teacher whenever I'm in town. It feels like a family.",
    rating: 5,
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Student, Grade 12",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100",
    content:
      "I love the arts program here. The annual cultural festival is my favorite event of the year. The school allows us to express ourselves while keeping us focused on our future careers.",
    rating: 4,
  },
  {
    id: 4,
    name: "Dr. Ahmed Khan",
    role: "Parent of two students",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
    content:
      "The security and safety measures at Sultan Zoy are top-notch. As a parent, knowing my children are safe and in a nurturing environment allows me to have peace of mind during the workday.",
    rating: 5,
  },
  {
    id: 5,
    name: "Layla Mahmoud",
    role: "Former Student Council President",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
    content:
      "Leadership opportunities at this school changed my life. The administration actually listens to student feedback. The 'Student Portal' makes tracking our grades and assignments so much easier.",
    rating: 5,
  },
  {
    id: 6,
    name: "Mr. David Chen",
    role: "Parent",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
    content:
      "The Parent-Teacher interaction system is fantastic. I feel involved in my son's education without being intrusive. The regular updates and the transparency of the administration are commendable.",
    rating: 4,
  },
];

// --- COMPONENTS ---

// 1. Star Rating Component
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={`${
            i < rating
              ? "fill-[var(--color-warning)] text-[var(--color-warning)]"
              : "fill-transparent text-[var(--color-muted)]"
          }`}
        />
      ))}
    </div>
  );
};

// 2. Testimonial Card Component
const TestimonialCard = ({ data }: { data: (typeof TESTIMONIALS_DATA)[0] }) => {
  return (
    <div
      className="group relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col
      bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-lg"
    >
      {/* Decorative Quote Icon Background */}
      <div className="absolute top-4 right-6 opacity-10 pointer-events-none">
        <Quote size={80} className="text-[var(--color-primary)]" />
      </div>

      {/* Header: Avatar & Info */}
      <div className="flex items-center gap-4 mb-6 z-10">
        <div className="relative">
          <img
            src={data.image}
            alt={data.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-[var(--color-primary)] p-0.5"
            onError={(e) => {
              // Fallback if image fails
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/100";
            }}
          />
        </div>
        <div>
          <h3 className="font-bold text-lg text-[var(--color-text-primary)] font-heading">
            {data.name}
          </h3>
          <p className="text-sm text-[var(--color-primary)] font-medium">
            {data.role}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={data.rating} />
      </div>

      {/* Content */}
      <p className="text-[var(--color-text-secondary)] leading-relaxed flex-grow italic relative z-10">
        "{data.content}"
      </p>
    </div>
  );
};

// 3. Main Testimonials Section Wrapper
function Testimonials() {
  return (
    <>
      <PageHeader
        title="Why Choose Us?"
        subtitle="Stories from our school community"
        breadcrumb={["Home", "Testimonials"]}
        image="images/bg-5.jpg"
      />
      <section className="py-20 px-4 md:px-8 bg-[var(--color-surface)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}

          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-[var(--color-primary)] bg-opacity-10 text-white text-sm font-bold tracking-wide uppercase mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-6 tracking-tight">
              What Our Community Says
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Hear from the parents, students, and alumni who make Sultan Zoy
              High School a center of excellence and community.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.map((item) => (
              <TestimonialCard key={item.id} data={item} />
            ))}
          </div>

          {/* Bottom CTA (Optional for this section) */}
          <div className="mt-16 text-center">
            <p className="text-[var(--color-text-secondary)] mb-4">
              Are you a member of our community?
            </p>
            <button className="px-8 py-3 rounded-lg bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-semibold hover:bg-[var(--color-card)] transition-colors duration-200 shadow-sm">
              Share Your Story
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

export default Testimonials;
