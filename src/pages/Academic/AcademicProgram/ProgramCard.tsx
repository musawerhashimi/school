import {
  Award,
  ChevronRight,
  Clock,
  GraduationCap,
  Star,
  Users,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { Program } from "../../../entities/program";

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
      className="group relative rounded-3xl p-6 bg-card shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden flex flex-col h-full border border-border/20"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 blur-3xl" />

      {/* Glowing Border Effect */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--accent)))",
          padding: "2px",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />

      {/* Floating Sparkle */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
        <Sparkles className="w-5 h-5 text-accent" />
      </div>

      {/* Content Wrapper with z-index */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          {/* Enhanced Image Container */}
          <div className="relative flex-shrink-0 group/img">
            <div className="w-full sm:w-40 sm:h-40 h-52 rounded-2xl overflow-hidden shadow-xl ring-2 ring-primary/20 group-hover:ring-4 group-hover:ring-primary/40 transition-all duration-500">
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-full object-cover transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/50 opacity-40 group-hover:opacity-70 transition-opacity duration-500" />

              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Enhanced Rating Badge */}
            <div className="absolute -bottom-3 -right-3 sm:-bottom-3 sm:-right-3 bg-card shadow-2xl border-2 border-accent rounded-full py-1.5 px-3.5 flex items-center gap-1.5 transform group-hover:scale-110 transition-all duration-300">
              <Star className="w-4 h-4 fill-accent text-accent animate-pulse" />
              <span className="text-xs font-bold text-accent">4.9</span>
            </div>

            {/* Trending Badge */}
            <div className="absolute -top-2 -left-2 bg-secondary shadow-lg border-2 border-card rounded-full p-2 transform group-hover:rotate-12 transition-all duration-300">
              <TrendingUp className="w-3.5 h-3.5 text-white" />
            </div>
          </div>

          {/* Enhanced Text Content */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-2xl font-black text-foreground leading-tight transition-all duration-300 group-hover:translate-x-1">
                {program.title}
              </h3>
              <span className="hidden sm:flex items-center text-xs font-bold px-3 py-1.5 rounded-full border-2 border-primary text-primary bg-primary/10 backdrop-blur-sm whitespace-nowrap transform group-hover:scale-105 transition-transform duration-300">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                {program.duration}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-grow transition-colors duration-300">
              {program.description}
            </p>

            {/* Enhanced Subject Pills */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {program.subjects.slice(0, 3).map((subject, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border-2 border-border bg-secondary/10 text-foreground transition-all duration-300 hover:scale-105 hover:border-secondary hover:bg-secondary/20 transform"
                >
                  {subject}
                </span>
              ))}
              {program.subjects.length > 3 && (
                <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-primary/10 text-primary">
                  +{program.subjects.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Glowing Divider */}
        <div className="relative h-px w-full mb-5 overflow-hidden">
          <div className="absolute inset-0 bg-border transition-all duration-500" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-auto">
          <div className="relative flex flex-col items-center justify-center p-3 rounded-xl bg-primary/5 transition-all duration-300 hover:scale-105 group/stat overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover/stat:opacity-20 bg-primary transition-opacity duration-300" />
            <div className="relative z-10 flex flex-col items-center">
              <GraduationCap className="w-5 h-5 mb-1.5 text-primary transition-transform duration-300 group-hover/stat:scale-110" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                Grades
              </span>
              <span className="font-black text-base text-foreground">
                {program.grades}
              </span>
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center p-3 rounded-xl bg-secondary/5 transition-all duration-300 hover:scale-105 group/stat overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover/stat:opacity-20 bg-secondary transition-opacity duration-300" />
            <div className="relative z-10 flex flex-col items-center">
              <Users className="w-5 h-5 mb-1.5 text-secondary transition-transform duration-300 group-hover/stat:scale-110" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                Students
              </span>
              <span className="font-black text-base text-foreground">
                {program.students}
              </span>
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center p-3 rounded-xl bg-accent/5 transition-all duration-300 hover:scale-105 group/stat overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover/stat:opacity-20 bg-accent transition-opacity duration-300" />
            <div className="relative z-10 flex flex-col items-center">
              <Award className="w-5 h-5 mb-1.5 text-accent transition-transform duration-300 group-hover/stat:scale-110" />
              <span className="text-xs font-bold uppercase tracking-wider opacity-60 mb-1">
                Teachers
              </span>
              <span className="font-black text-base text-foreground">
                {program.teachers}
              </span>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Button */}
        <div className="mt-6 pt-4 border-t-2 border-border flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
            Explore Program
          </span>
          <button className="relative text-sm font-black flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground transition-all duration-300 group-hover:gap-3 overflow-hidden hover:shadow-lg">
            <span className="relative z-10">View Details</span>
            <ChevronRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </button>
        </div>
      </div>
    </div>
  );
}
