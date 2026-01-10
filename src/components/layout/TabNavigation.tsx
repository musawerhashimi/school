// import type { Tab } from "../../entities/program";

// export default function TabNavigation({
//   tabs,
//   activeTab,
//   onTabChange,
// }: {
//   tabs: Tab[];
//   activeTab: string;
//   onTabChange: (id: string) => void;
// }) {
//   return (
//     <div className="flex flex-wrap gap-2 mb-8 border-b border-border">
//       {tabs.map((tab) => (
//         <button
//           key={tab.id}
//           onClick={() => onTabChange(tab.id)}
//           className={`px-6 py-3 font-semibold transition-all relative ${
//             activeTab === tab.id
//               ? "text-primary border-b-2 border-primary"
//               : "text-text-secondary hover:text-text-primary"
//           }`}
//         >
//           <div className="flex items-center gap-2">
//             {tab.icon}
//             {tab.label}
//           </div>
//         </button>
//       ))}
//     </div>
//   );
// }

import type { Tab } from "../../entities/program";

export default function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
}: {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}) {
  return (
    <div className="relative">
      {/* Background Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Tabs Container */}
      <div className="flex overflow-x-auto gap-1 mb-0 relative scrollbar-hide">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group relative px-6 py-4 font-bold transition-all duration-300 rounded-t-xl overflow-hidden flex-shrink-0 ${
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground hover:scale-102"
              }`}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Background Effects */}
              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent opacity-100"
                    : "bg-card/50 opacity-0 group-hover:opacity-100"
                }`}
              />

              {/* Glowing Border Effect for Active Tab */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-t-xl opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
                    padding: "2px 2px 0 2px",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                />
              )}

              {/* Hover Glow */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}

              {/* Bottom Active Indicator */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary transition-all duration-300 ${
                  isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                }`}
              />

              {/* Shimmer Effect on Hover */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Tab Content */}
              <div
                className={`relative z-10 flex items-center gap-2.5 transition-all duration-300 ${
                  isActive ? "gap-3" : ""
                }`}
              >
                {/* Icon Container */}
                <div
                  className={`transition-all duration-300 ${
                    isActive
                      ? "scale-110 rotate-6"
                      : "group-hover:scale-105 group-hover:rotate-3"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? "bg-primary/20 shadow-lg shadow-primary/20"
                        : "bg-muted/50 group-hover:bg-primary/10"
                    }`}
                  >
                    {tab.icon}
                  </div>
                </div>

                {/* Label */}
                <span
                  className={`font-black uppercase tracking-wide text-sm transition-all duration-300 hidden md:inline-block ${
                    isActive ? "text-primary" : "group-hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </span>

                {/* Active Badge */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse shadow-lg shadow-accent/50" />
                )}
              </div>

              {/* Top Accent Line for Active */}
              {isActive && (
                <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Animated Bottom Border */}
      <div className="relative h-0.5 bg-border">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse" />
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scale-102 {
          transform: scale(1.02);
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
