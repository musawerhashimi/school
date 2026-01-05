import {
  Award,
  ChevronRight,
  Clock,
  GraduationCap,
  Star,
  Users,
} from "lucide-react";
import type { Program } from "../../entities/program";

// export default function ProgramCard({
//   program,
//   onClick,
// }: {
//   program: Program;
//   onClick: () => void;
// }) {
//   return (
//     <div
//       onClick={onClick}
//       className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:-translate-y-1"
//     >
//       <div className="flex items-start gap-4 mb-4">
//         <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-110 transition-transform duration-300">
//           <img
//             src={program.image}
//             alt={program.title}
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//         </div>
//         <div className="flex-1">
//           <h3 className="text-2xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
//             {program.title}
//           </h3>
//           <p className="text-text-secondary">{program.description}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-4 mb-4 py-4 border-y border-border">
//         <div className="text-center">
//           <div className="flex items-center justify-center gap-1 text-primary mb-1">
//             <GraduationCap className="w-5 h-5" />
//           </div>
//           <div className="text-sm text-text-secondary">Grades</div>
//           <div className="font-semibold text-text-primary">
//             {program.grades}
//           </div>
//         </div>
//         <div className="text-center">
//           <div className="flex items-center justify-center gap-1 text-secondary mb-1">
//             <Users className="w-5 h-5" />
//           </div>
//           <div className="text-sm text-text-secondary">Students</div>
//           <div className="font-semibold text-text-primary">
//             {program.students}
//           </div>
//         </div>
//         <div className="text-center">
//           <div className="flex items-center justify-center gap-1 text-accent mb-1">
//             <Award className="w-5 h-5" />
//           </div>
//           <div className="text-sm text-text-secondary">Teachers</div>
//           <div className="font-semibold text-text-primary">
//             {program.teachers}
//           </div>
//         </div>
//       </div>

//       <div className="mb-4">
//         <h4 className="font-semibold text-text-primary mb-2">Subjects:</h4>
//         <div className="flex flex-wrap gap-2">
//           {program.subjects.map((subject, index) => (
//             <span
//               key={index}
//               className="px-3 py-1 bg-surface text-text-secondary text-sm rounded-full border border-border"
//             >
//               {subject}
//             </span>
//           ))}
//         </div>
//       </div>

//       <div className="flex items-center justify-between text-primary font-semibold group-hover:gap-2 transition-all">
//         <span>Learn More</span>
//         <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//       </div>
//     </div>
//   );
// }

// --- Component: ProgramCard ---
export default function ProgramCard({
  program,
  onClick,
}: {
  program: Program;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl border p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full animate-fade-in"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Top Decoration Line */}
      <div
        className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(to right, var(--color-primary), var(--color-secondary))",
        }}
      />

      {/* Main Content Area */}
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        {/* Large Corner Image */}
        <div className="relative flex-shrink-0">
          <div
            className="w-full sm:w-36 sm:h-36 h-48 rounded-xl overflow-hidden shadow-md transition-all duration-300 ring-1"
            style={{ borderColor: "var(--color-border)" }}
          >
            <img
              src={program.image}
              alt={program.title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Rating Badge */}
          <div
            className="absolute -bottom-3 -right-3 sm:-bottom-2 sm:-right-2 shadow-lg border rounded-full py-1 px-3 flex items-center gap-1"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border)",
            }}
          >
            <Star
              className="w-3.5 h-3.5 fill-current"
              style={{ color: "var(--color-accent)" }}
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3
              className="text-xl font-bold leading-tight transition-colors group-hover:text-[var(--color-secondary)]"
              style={{ color: "var(--color-text-primary)" }}
            >
              {program.title}
            </h3>
            <span
              className="hidden sm:flex items-center text-xs font-medium px-2 py-1 rounded-md border whitespace-nowrap"
              style={{
                color: "var(--color-muted)",
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <Clock className="w-3 h-3 mr-1" />
              {program.duration}
            </span>
          </div>

          <p
            className="text-sm leading-relaxed line-clamp-3 mb-4 flex-grow"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {program.description}
          </p>

          {/* Subjects Pills */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {program.subjects.slice(0, 3).map((subject, index) => (
              <span
                key={index}
                className="px-2.5 py-1 text-xs font-medium rounded-md border transition-colors"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-text-secondary)",
                  borderColor: "var(--color-border)",
                }}
              >
                {subject}
              </span>
            ))}
            {program.subjects.length > 3 && (
              <span
                className="px-2 py-1 text-xs"
                style={{ color: "var(--color-muted)" }}
              >
                + {program.subjects.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Divider */}
      <div
        className="h-px w-full mb-4 transition-colors"
        style={{ backgroundColor: "var(--color-surface-hover)" }}
      />

      {/* Footer Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mt-auto">
        <div
          className="flex flex-col items-center justify-center p-2 rounded-lg transition-colors"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div
            className="flex items-center gap-1.5 mb-1"
            style={{ color: "var(--color-primary)" }}
          >
            <GraduationCap className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
              Grades
            </span>
          </div>
          <span
            className="font-bold text-sm"
            style={{ color: "var(--color-text-primary)" }}
          >
            {program.grades}
          </span>
        </div>

        <div
          className="flex flex-col items-center justify-center p-2 rounded-lg transition-colors"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div
            className="flex items-center gap-1.5 mb-1"
            style={{ color: "var(--color-secondary)" }}
          >
            <Users className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
              Students
            </span>
          </div>
          <span
            className="font-bold text-sm"
            style={{ color: "var(--color-text-primary)" }}
          >
            {program.students}
          </span>
        </div>

        <div
          className="flex flex-col items-center justify-center p-2 rounded-lg transition-colors"
          style={{ backgroundColor: "var(--color-surface)" }}
        >
          <div
            className="flex items-center gap-1.5 mb-1"
            style={{ color: "var(--color-accent)" }}
          >
            <Award className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wide opacity-70">
              Teachers
            </span>
          </div>
          <span
            className="font-bold text-sm"
            style={{ color: "var(--color-text-primary)" }}
          >
            {program.teachers}
          </span>
        </div>
      </div>

      {/* Call to Action Button */}
      <div
        className="mt-5 pt-3 border-t flex items-center justify-end"
        style={{ borderColor: "var(--color-border)" }}
      >
        <button
          className="text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all duration-300"
          style={{ color: "var(--color-primary)" }}
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
