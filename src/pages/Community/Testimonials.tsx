// import { Quote, Star } from "lucide-react";
// import PageHeader from "../../components/layout/PageHeader";
// import { TESTIMONIALS_DATA } from "../../data/testmonial";

// // 1. Star Rating Component
// const StarRating = ({ rating }: { rating: number }) => {
//   return (
//     <div className="flex gap-1">
//       {[...Array(5)].map((_, i) => (
//         <Star
//           key={i}
//           size={16}
//           className={`${
//             i < rating
//               ? "fill-[var(--color-warning)] text-[var(--color-warning)]"
//               : "fill-transparent text-[var(--color-muted)]"
//           }`}
//         />
//       ))}
//     </div>
//   );
// };

// // 2. Testimonial Card Component
// const TestimonialCard = ({ data }: { data: (typeof TESTIMONIALS_DATA)[0] }) => {
//   return (
//     <div
//       className="group relative p-8 rounded-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col
//       bg-[var(--color-card)] border border-[var(--color-border)] shadow-sm hover:shadow-lg"
//     >
//       {/* Decorative Quote Icon Background */}
//       <div className="absolute top-4 right-6 opacity-10 pointer-events-none">
//         <Quote size={80} className="text-[var(--color-primary)]" />
//       </div>

//       {/* Header: Avatar & Info */}
//       <div className="flex items-center gap-4 mb-6 z-10">
//         <div className="relative">
//           <img
//             src={data.image}
//             alt={data.name}
//             className="w-14 h-14 rounded-full object-cover border-2 border-[var(--color-primary)] p-0.5"
//             onError={(e) => {
//               // Fallback if image fails
//               (e.target as HTMLImageElement).src =
//                 "https://via.placeholder.com/100";
//             }}
//           />
//         </div>
//         <div>
//           <h3 className="font-bold text-lg text-[var(--color-text-primary)] font-heading">
//             {data.name}
//           </h3>
//           <p className="text-sm text-[var(--color-primary)] font-medium">
//             {data.role}
//           </p>
//         </div>
//       </div>

//       {/* Rating */}
//       <div className="mb-4">
//         <StarRating rating={data.rating} />
//       </div>

//       {/* Content */}
//       <p className="text-[var(--color-text-secondary)] leading-relaxed flex-grow italic relative z-10">
//         "{data.content}"
//       </p>
//     </div>
//   );
// };

// // 3. Main Testimonials Section Wrapper
// export default function Testimonials() {
//   return (
//     <>
//       <PageHeader
//         title="Why Choose Us?"
//         subtitle="Stories from our school community"
//         breadcrumb={[
//           { name: "Home", path: "/" },
//           { name: "Testimonials", path: "" },
//         ]}
//         image="images/testumunial.jpeg"
//       />
//       <section className="py-20 px-4 md:px-8 bg-[var(--color-surface)] transition-colors duration-300">
//         <div className="max-w-7xl mx-auto">
//           {/* Section Header */}

//           <div className="text-center mb-16 max-w-3xl mx-auto">
//             <span className="inline-block py-1 px-3 rounded-full bg-[var(--color-primary)] bg-opacity-10 text-white text-sm font-bold tracking-wide uppercase mb-4">
//               Testimonials
//             </span>
//             <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-6 tracking-tight">
//               What Our Community Says
//             </h2>
//             <p className="text-lg text-[var(--color-text-secondary)]">
//               Hear from the parents, students, and alumni who make Sultan Zoy
//               High School a center of excellence and community.
//             </p>
//           </div>

//           {/* Grid Layout */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {TESTIMONIALS_DATA.map((item) => (
//               <TestimonialCard key={item.id} data={item} />
//             ))}
//           </div>

//           {/* Bottom CTA (Optional for this section) */}
//           <div className="mt-16 text-center">
//             <p className="text-[var(--color-text-secondary)] mb-4">
//               Are you a member of our community?
//             </p>
//             <button className="px-8 py-3 rounded-lg bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-semibold hover:bg-[var(--color-card)] transition-colors duration-200 shadow-sm">
//               Share Your Story
//             </button>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

import { Quote, Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../components/layout/PageHeader";
import { TESTIMONIALS_DATA } from "../../data/testmonial";
import ShareStoryModal from "./Sharestorymodal";

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
export default function Testimonials() {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <PageHeader
        title={t("testimonials.header.title")}
        subtitle={t("testimonials.header.subtitle")}
        breadcrumb={[
          { name: t("testimonials.breadcrumb.home"), path: "/" },
          { name: t("testimonials.breadcrumb.testimonials"), path: "" },
        ]}
        image="images/testumunial.jpeg"
      />
      <section className="py-20 px-4 md:px-8 bg-[var(--color-surface)] transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}

          <div className="text-center mb-16 max-w-3xl mx-auto">
            <span className="inline-block py-1 px-3 rounded-full bg-[var(--color-primary)] bg-opacity-10 text-white text-sm font-bold tracking-wide uppercase mb-4">
              {t("testimonials.badge")}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-6 tracking-tight">
              {t("testimonials.title")}
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)]">
              {t("testimonials.description")}
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS_DATA.map((item) => (
              <TestimonialCard key={item.id} data={item} />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-[var(--color-text-secondary)] mb-4">
              {t("testimonials.cta.question")}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-3 rounded-lg bg-[var(--color-surface-hover)] text-[var(--color-text-primary)] border border-[var(--color-border)] font-semibold hover:bg-[var(--color-card)] transition-colors duration-200 shadow-sm"
            >
              {t("testimonials.cta.button")}
            </button>
          </div>
        </div>
      </section>

      {/* Share Story Modal */}
      <ShareStoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
