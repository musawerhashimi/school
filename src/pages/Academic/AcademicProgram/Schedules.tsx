import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { classSchedules } from "../../../data/acadimicdata";
import SectionHeading from "./SectionHeading";

export default function Schedules() {
  return (
    <div>
      <SectionHeading
        title="Class Schedules"
        subtitle="Regular class timings for all grade levels"
      />
      <div className="grid md:grid-cols-2 gap-6">
        {classSchedules.map((schedule, index) => (
          <div
            key={index}
            className="group relative bg-card border border-border/50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-500 overflow-hidden"
          >
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            {/* Glowing Border Effect */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
                padding: "2px",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />

            {/* Sparkle Icon */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:rotate-12">
              <Sparkles className="w-5 h-5 text-accent" />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header with Class Number */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <span className="text-2xl font-black text-white">
                      {schedule.class}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-300">
                      Class {schedule.class}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="space-y-3 mb-6">
                <div className="group/item relative flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover/item:opacity-10 bg-primary transition-opacity duration-300" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-semibold text-foreground">
                      School Hours
                    </span>
                  </div>
                  <span className="relative z-10 font-black text-lg text-primary">
                    {schedule.time}
                  </span>
                </div>

                <div className="group/item relative flex items-center justify-between p-4 rounded-xl bg-secondary/5 border border-secondary/20 hover:bg-secondary/10 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover/item:opacity-10 bg-secondary transition-opacity duration-300" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="font-semibold text-foreground">
                      Total Periods
                    </span>
                  </div>
                  <span className="relative z-10 font-black text-lg text-secondary">
                    {schedule.periods} Periods
                  </span>
                </div>

                <div className="group/item relative flex items-center justify-between p-4 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-all duration-300 overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover/item:opacity-10 bg-accent transition-opacity duration-300" />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-semibold text-foreground">
                      Number of Class
                    </span>
                  </div>
                  <span className="relative z-10 font-black text-lg text-accent">
                    {schedule.number_of_class}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="relative h-px w-full mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-border" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-primary to-transparent" />
              </div>

              {/* CTA Button */}
              <Link
                to={`/class/${schedule.class}`}
                className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-4 rounded-xl font-black text-sm uppercase tracking-wide hover:shadow-xl transition-all duration-300 group-hover:gap-3 overflow-hidden"
              >
                <span className="relative z-10">View Detailed Schedule</span>
                <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />

                {/* Button Shimmer */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
