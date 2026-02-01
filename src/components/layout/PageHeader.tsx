// import { ChevronRight } from "lucide-react";
// import React from "react";

// export default function PageHeader({
//   title,
//   subtitle,
//   image,
//   breadcrumb,
// }: {
//   title: string;
//   subtitle: string;
//   image: string;
//   breadcrumb: string[];
// }) {
//   return (
//     <div className="relative text-text-secondary h-96 w-full overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/70 to-background/60 z-10" />
//       <img src={image} alt={title} className="w-full h-full object-cover" />
//       <div className="absolute z-20 top-20 w-full">
//         <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
//             {breadcrumb.map((item, index) => (
//               <React.Fragment key={index}>
//                 <span
//                   className={
//                     index === breadcrumb.length - 1 ? "font-semibold" : ""
//                   }
//                 >
//                   {item}
//                 </span>
//                 {index < breadcrumb.length - 1 && (
//                   <ChevronRight className="w-4 h-4" />
//                 )}
//               </React.Fragment>
//             ))}
//           </div>
//           <div className="flex items-center">
//             <div>
//               <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-2 md:mb-4 md:mt-8 mt:4 ">
//                 {title}
//               </h1>
//               <p className="text-xl md:text-2xl text-text-secondary max-w-2xl">
//                 {subtitle}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import { ChevronRight, ChevronLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom"; // Make sure you have react-router-dom installed
import { useTranslation } from "react-i18next";

interface BreadcrumbItem {
  name: string;
  path: string;
}

export default function PageHeader({
  title,
  subtitle,
  image,
  breadcrumb,
}: {
  title: string;
  subtitle: string;
  image: string;
  breadcrumb: BreadcrumbItem[];
}) {
  const { i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";
  
  // Use ChevronLeft for da and pa (RTL languages), ChevronRight for en
  const ChevronIcon = lang === "da" || lang === "pa" ? ChevronLeft : ChevronRight;

  return (
    <div className="relative text-text-secondary h-96 w-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/70 to-background/60 z-10" />
      <img src={image} alt={title} className="w-full h-full object-cover" />
      <div className="absolute z-20 top-20 w-full">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
            {breadcrumb.map((item, index) => (
              <React.Fragment key={index}>
                {index === breadcrumb.length - 1 ? (
                  <span className="font-semibold">{item.name}</span>
                ) : (
                  <Link
                    to={item.path}
                    className="hover:text-text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
                {index < breadcrumb.length - 1 && (
                  <ChevronIcon className="w-4 h-4" />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-2 md:mb-4 md:mt-8 mt-4">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-text-secondary max-w-2xl">
                {subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}