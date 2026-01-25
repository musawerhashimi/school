// import { Calendar, Play } from "lucide-react";
// import { useState } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   culturalEventsData,
//   performanceHighlightsData,
// } from "../../../data/art";
// import CTASection from "../../../components/CTASection";
// import PageHeader from "../../../components/layout/PageHeader";

// const PerformingArtsPage: React.FC = () => {
//   const { t, i18n } = useTranslation();
//   const lang = i18n.language as "en" | "da" | "pa";
//   const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString(lang === "en" ? "en-US" : "fa-AF", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Hero Section */}

//       <PageHeader
//         breadcrumb={["home", "performingArts"]}
//         image="images/slide4.jpg"
//         subtitle={t("performingArts.hero.description")}
//         title={t("performingArts.hero.title")}
//       />

//       {/* Cultural Events Section */}
//       <section className="py-16 bg-background">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
//             <div>
//               <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
//                 {t("performingArts.events.title")}
//               </h2>
//               <p className="text-text-secondary">
//                 {t("performingArts.events.subtitle")}
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {culturalEventsData.map((event) => (
//               <div
//                 key={event.id}
//                 className="card group overflow-hidden lg:col-span-2"
//               >
//                 <div className="flex flex-col  md:flex-row gap-6">
//                   <div className="relative overflow-hidden rounded-lg w-full">
//                     <img
//                       src={event.image}
//                       alt={event.title[lang]}
//                       className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
//                     />
//                   </div>

//                   <div className="flex-1">
//                     <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors">
//                       {event.title[lang]}
//                     </h3>

//                     <p className="text-text-secondary mb-4 leading-relaxed">
//                       {event.description[lang]}
//                     </p>

//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2 text-text-secondary">
//                         <Calendar className="w-4 h-4" />
//                         <span className="text-sm">
//                           {formatDate(event.date)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Performance Highlights Section */}
//       <section className="py-16 bg-surface">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
//               {t("performingArts.highlights.title")}
//             </h2>
//             <p className="text-text-secondary text-lg">
//               {t("performingArts.highlights.subtitle")}
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {performanceHighlightsData.map((performance) => (
//               <div
//                 key={performance.id}
//                 className="card group overflow-hidden hover:shadow-2xl transition-all duration-300"
//               >
//                 <div
//                   className="relative overflow-hidden rounded-lg mb-4 cursor-pointer"
//                   onClick={() => setSelectedVideo(performance.id)}
//                 >
//                   <img
//                     src={performance.videoThumbnail}
//                     alt={performance.title[lang]}
//                     className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
//                     <div className="bg-white/90 p-4 rounded-full group-hover:scale-110 transition-transform">
//                       <Play className="w-8 h-8 text-primary" />
//                     </div>
//                   </div>
//                   <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
//                     {formatDate(performance.date)}
//                   </div>
//                 </div>

//                 <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
//                   {performance.title[lang]}
//                 </h3>

//                 <p className="text-text-secondary text-sm line-clamp-2">
//                   {performance.description[lang]}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <CTASection />
//     </div>
//   );
// };

// export default PerformingArtsPage;

import { Calendar, Play, ArrowRight, Clock, MapPin } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  culturalEventsData,
  performanceHighlightsData,
} from "../../../data/art";
import CTASection from "../../../components/CTASection";
import PageHeader from "../../../components/layout/PageHeader";

// --- Internal Skeleton Components ---
const CulturalEventSkeleton = () => (
  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-pulse">
    <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl w-full"></div>
    <div className="flex flex-col justify-center space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mt-4"></div>
    </div>
  </div>
);

const HighlightSkeleton = () => (
  <div className="flex flex-col space-y-3 animate-pulse">
    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl w-full"></div>
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);

const PerformingArtsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay to show off the skeleton
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === "en" ? "en-US" : "fa-AF", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background font-sans text-text-primary">
      {/* Hero Section */}
      <PageHeader
        breadcrumb={["home", "performingArts"]}
        image="images/sild6.jpeg"
        subtitle={t("performingArts.hero.description")}
        title={t("performingArts.hero.title")}
      />

      {/* Cultural Events Section */}
      <section className="py-10 bg-background md:m-6">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-4 tracking-tight">
              {t("performingArts.events.title")}
            </h2>
            <div className="h-1 w-20 bg-primary mx-auto mb-6 rounded-full"></div>
            <p className="text-text-secondary text-lg leading-relaxed">
              {t("performingArts.events.subtitle")}
            </p>
          </div>

          <div className="space-y-16">
            {isLoading ? (
              // Skeleton Loading State
              <>
                <CulturalEventSkeleton />
                <CulturalEventSkeleton />
              </>
            ) : (
              // Actual Content
              culturalEventsData.map((event, index) => (
                <div
                  key={event.id}
                  className={`flex flex-col ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-8 lg:gap-16 items-center group`}
                >
                  {/* Image Side */}
                  <div className="w-full lg:w-1/2 relative">
                    <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/3] lg:aspect-video">
                      <div className="absolute inset-0 bg-primary/10 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                      <img
                        src={event.image}
                        alt={event.title[lang]}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 z-20 bg-background/90 backdrop-blur-md shadow-lg rounded-xl p-3 text-center min-w-[70px]">
                        <span className="block text-2xl font-bold text-primary">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                          {new Date(event.date).toLocaleString(
                            lang === "en" ? "en-US" : "fa-AF",
                            { month: "short" },
                          )}
                        </span>
                      </div>
                    </div>
                    {/* Decorative Element */}
                    <div
                      className={`absolute -bottom-4 -right-4 w-24 h-24 bg-primary/5 rounded-full -z-10 transition-transform duration-500 group-hover:scale-150 ${
                        index % 2 !== 0 ? "right-auto -left-4" : ""
                      }`}
                    />
                  </div>

                  {/* Content Side */}
                  <div className="w-full lg:w-1/2 space-y-6">
                    <h3 className="text-3xl md:text-4xl font-bold text-text-primary group-hover:text-primary transition-colors duration-300">
                      {event.title[lang]}
                    </h3>

                    <div className="flex items-center gap-6 text-sm text-text-secondary font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>Main Auditorium</span>
                      </div>
                    </div>

                    <p className="text-text-secondary leading-relaxed text-lg">
                      {event.description[lang]}
                    </p>

                    <button className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all duration-300 uppercase tracking-wide text-sm">
                      Read Details <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Performance Highlights Section */}
      <section className="py-10 bg-surface relative overflow-hidden md:m-6">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary via-background to-background pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-primary font-bold uppercase tracking-widest text-sm mb-2 block">
                Watch & Listen
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                {t("performingArts.highlights.title")}
              </h2>
            </div>
            <div className="hidden md:block">
              <button className="px-6 py-2 rounded-full border border-border hover:bg-background hover:text-primary transition-colors text-text-secondary text-sm font-medium">
                View All Videos
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? // Skeleton Grid
                Array(3)
                  .fill(0)
                  .map((_, i) => <HighlightSkeleton key={i} />)
              : // Actual Grid
                performanceHighlightsData.map((performance) => (
                  <div
                    key={performance.id}
                    className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-border/50"
                  >
                    {/* Video Thumbnail */}
                    <div
                      className="relative aspect-video overflow-hidden cursor-pointer"
                      onClick={() => setSelectedVideo(performance.id)}
                    >
                      <img
                        src={performance.videoThumbnail}
                        alt={performance.title[lang]}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/40 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-lg">
                          <Play className="w-6 h-6 text-white ml-1 fill-white" />
                        </div>
                      </div>
                      {/* Duration Badge (Mock) */}
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
                        04:20
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                        <Calendar className="w-3 h-3" />
                        {formatDate(performance.date)}
                      </div>

                      <h3 className="text-xl font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {performance.title[lang]}
                      </h3>

                      <p className="text-text-secondary text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
                        {performance.description[lang]}
                      </p>

                      <div className="w-full h-px bg-border/50 group-hover:bg-primary/20 transition-colors mt-auto"></div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </div>
  );
};

export default PerformingArtsPage;
