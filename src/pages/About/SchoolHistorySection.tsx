// import { useTranslation } from "react-i18next";

// export default function SchoolHistorySection() {
//   const { t } = useTranslation();

//   const schoolHistoryData = {
//     title: t("about.history.title"),
//     subtitle: t("about.history.subtitle"),
//     description: t("about.history.description"),
//     image: "images/bg-5.jpg",
//     ourStory: t("about.history.ourStory"),
//     milestones: [
//       {
//         year: "1995",
//         title: t("about.history.milestone1.title"),
//         description: t("about.history.milestone1.description"),
//         image: "images/bg-1.jpg",
//       },
//       {
//         year: "2000",
//         title: t("about.history.milestone2.title"),
//         description: t("about.history.milestone2.description"),
//         image: "images/bg-2.jpg",
//       },
//       {
//         year: "2010",
//         title: t("about.history.milestone3.title"),
//         description: t("about.history.milestone3.description"),
//         image: "images/bg-3.jpg",
//       },
//       {
//         year: "2015",
//         title: t("about.history.milestone4.title"),
//         description: t("about.history.milestone4.description"),
//         image: "images/bg-4.jpg",
//       },
//       {
//         year: "2020",
//         title: t("about.history.milestone5.title"),
//         description: t("about.history.milestone5.description"),
//         image: "images/bg-5.jpg",
//       },
//       {
//         year: "2024",
//         title: t("about.history.milestone6.title"),
//         description: t("about.history.milestone6.description"),
//         image: "images/bg-1.jpg",
//       },
//     ],
//   };

//   return (
//     <section className="py-20 bg-surface">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
//             {schoolHistoryData.title}
//           </h2>
//           <p className="text-xl text-text-secondary mb-8">
//             {schoolHistoryData.subtitle}
//           </p>
//         </div>

//         {/* School History Description with Image */}
//         <div className="max-w-6xl mx-auto mb-20">
//           <div className="grid md:grid-cols-2 gap-8 items-center">
//             <div className="relative h-96 rounded-2xl overflow-hidden group">
//               <img
//                 src={schoolHistoryData.image}
//                 alt={t("about.history.imageAlt")}
//                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
//             </div>
//             <div>
//               <h3 className="text-3xl font-bold text-text-primary mb-6">
//                 {schoolHistoryData.ourStory}
//               </h3>
//               <p className="text-text-secondary leading-relaxed text-lg">
//                 {schoolHistoryData.description}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Amazing Timeline with Images */}
//         <div className="space-y-16">
//           {schoolHistoryData.milestones.map((milestone, index) => (
//             <div
//               key={index}
//               className={`flex flex-col md:flex-row gap-8 items-center ${
//                 index % 2 !== 0 ? "md:flex-row-reverse" : ""
//               }`}
//             >
//               {/* Image Side */}
//               <div className="flex-1">
//                 <div className="relative h-80 rounded-2xl overflow-hidden group shadow-2xl">
//                   <img
//                     src={milestone.image}
//                     alt={milestone.title}
//                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
//                   <div className="absolute bottom-0 left-0 right-0 p-6">
//                     <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-bold mb-2">
//                       {milestone.year}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Content Side */}
//               <div className="flex-1">
//                 <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
//                   <div className="flex items-center space-x-4 mb-4">
//                     <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
//                       <span className="text-white font-bold text-lg">
//                         {index + 1}
//                       </span>
//                     </div>
//                     <h3 className="text-2xl font-bold text-text-primary">
//                       {milestone.title}
//                     </h3>
//                   </div>
//                   <p className="text-text-secondary leading-relaxed text-lg">
//                     {milestone.description}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

// Skeleton Components
const ImageSkeleton = () => (
  <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer" />
  </div>
);

const TextSkeleton = ({ lines = 3 }) => (
  <div className="space-y-3">
    {[...Array(lines)].map((_, i) => (
      <div
        key={i}
        className="h-4 bg-gray-200 rounded animate-pulse"
        style={{ width: i === lines - 1 ? "80%" : "100%" }}
      />
    ))}
  </div>
);

const CardSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl p-8">
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
      <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
    </div>
    <TextSkeleton lines={4} />
  </div>
);

export default function SchoolHistorySection() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const schoolHistoryData = {
    title: t("about.history.title"),
    subtitle: t("about.history.subtitle"),
    description: t("about.history.description"),
    image: "images/bg-5.jpg",
    ourStory: t("about.history.ourStory"),
    milestones: [
      {
        year: "1995",
        title: t("about.history.milestone1.title"),
        description: t("about.history.milestone1.description"),
        image: "images/bg-1.jpg",
      },
      {
        year: "2000",
        title: t("about.history.milestone2.title"),
        description: t("about.history.milestone2.description"),
        image: "images/bg-2.jpg",
      },
      {
        year: "2010",
        title: t("about.history.milestone3.title"),
        description: t("about.history.milestone3.description"),
        image: "images/bg-3.jpg",
      },
      {
        year: "2015",
        title: t("about.history.milestone4.title"),
        description: t("about.history.milestone4.description"),
        image: "images/bg-4.jpg",
      },
      {
        year: "2020",
        title: t("about.history.milestone5.title"),
        description: t("about.history.milestone5.description"),
        image: "images/bg-5.jpg",
      },
      {
        year: "2024",
        title: t("about.history.milestone6.title"),
        description: t("about.history.milestone6.description"),
        image: "images/bg-1.jpg",
      },
    ],
  };

  return (
    <section className="py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          {isLoading ? (
            <>
              <div className="h-12 bg-gray-200 rounded w-96 mx-auto mb-4 animate-pulse" />
              <div className="h-6 bg-gray-200 rounded w-64 mx-auto mb-8 animate-pulse" />
            </>
          ) : (
            <>
              <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                {schoolHistoryData.title}
              </h2>
              <p className="text-xl text-text-secondary mb-8">
                {schoolHistoryData.subtitle}
              </p>
            </>
          )}
        </div>

        {/* School History Description with Image */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {isLoading ? (
              <>
                <ImageSkeleton />
                <div>
                  <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse" />
                  <TextSkeleton lines={6} />
                </div>
              </>
            ) : (
              <>
                <div className="relative h-96 rounded-2xl overflow-hidden group">
                  <img
                    src={schoolHistoryData.image}
                    alt={t("about.history.imageAlt")}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-text-primary mb-6">
                    {schoolHistoryData.ourStory}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    {schoolHistoryData.description}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Amazing Timeline with Images */}
        <div className="space-y-16">
          {schoolHistoryData.milestones.map((milestone, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row gap-8 items-center ${
                index % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <div className="flex-1">
                    <ImageSkeleton />
                  </div>
                  <div className="flex-1">
                    <CardSkeleton />
                  </div>
                </>
              ) : (
                <>
                  {/* Image Side */}
                  <div className="flex-1">
                    <div className="relative h-80 rounded-2xl overflow-hidden group shadow-2xl">
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-bold mb-2">
                          {milestone.year}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1">
                    <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {index + 1}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-text-primary">
                          {milestone.title}
                        </h3>
                      </div>
                      <p className="text-text-secondary leading-relaxed text-lg">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
