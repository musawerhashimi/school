// import {
//   Linkedin,
//   Globe,
//   Award,
//   Mail,
//   Phone,
//   MapPin,
//   Calendar,
//   BookOpen,
// } from "lucide-react";

// export default function TeacherProfile({ teacher, onBack }: TeacherCardProps) {
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-surface to-card text-text-primary pb-20 pt-5 mt-20">
//         <div className="container mx-auto px-4">
//           <button
//             onClick={onBack}
//             className="mb-6 text-text-primary hover:text-primary-dark flex items-center gap-2 transition-colors"
//           >
//             ← Back to Teachers
//           </button>
//           <div className="flex flex-col md:flex-row gap-8 items-start">
//             <img
//               src={teacher.image}
//               alt={teacher.name}
//               className="w-48 h-48 rounded-2xl object-cover border-4 border-white/20 shadow-2xl"
//             />
//             <div className="flex-1">
//               <h1 className="text-4xl font-bold mb-2">{teacher.name}</h1>
//               <p className="text-xl opacity-90 mb-4">{teacher.role}</p>
//               <div className="flex flex-wrap gap-3 mb-6">
//                 <span className="px-4 py-2 bg-card rounded-lg text-sm font-medium backdrop-blur-sm border border-border">
//                   {teacher.department}
//                 </span>
//                 <span className="px-4 py-2 bg-card rounded-lg text-sm font-medium backdrop-blur-sm border border-border">
//                   {teacher.experience} Experience
//                 </span>
//               </div>
//               <div className="flex gap-4">
//                 {teacher.linkedin && (
//                   <a
//                     href={teacher.linkedin}
//                     className="p-2 bg-card rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm border border-border"
//                   >
//                     <Linkedin className="w-5 h-5" />
//                   </a>
//                 )}
//                 {teacher.website && (
//                   <a
//                     href={teacher.website}
//                     className="p-2 bg-card rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm border border-border"
//                   >
//                     <Globe className="w-5 h-5" />
//                   </a>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-12">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Bio */}
//             <div className="bg-card rounded-xl p-6 border border-border">
//               <h2 className="text-2xl font-bold text-text-primary mb-4">
//                 About
//               </h2>
//               <p className="text-text-secondary leading-relaxed">
//                 {teacher.bio}
//               </p>
//             </div>

//             {/* Education */}
//             <div className="bg-card rounded-xl p-6 border border-border">
//               <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
//                 <Award className="w-6 h-6 text-primary" />
//                 Education
//               </h2>
//               <ul className="space-y-3">
//                 {teacher.education.map((edu, idx) => (
//                   <li key={idx} className="flex items-start gap-3">
//                     <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
//                     <span className="text-text-secondary">{edu}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Specializations */}
//             <div className="bg-card rounded-xl p-6 border border-border">
//               <h2 className="text-2xl font-bold text-text-primary mb-4">
//                 Specializations
//               </h2>
//               <div className="flex flex-wrap gap-3">
//                 {teacher.specializations.map((spec, idx) => (
//                   <span
//                     key={idx}
//                     className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium border border-primary/20"
//                   >
//                     {spec}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Achievements */}
//             <div className="bg-card rounded-xl p-6 border border-border">
//               <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
//                 <Award className="w-6 h-6 text-accent" />
//                 Achievements & Recognition
//               </h2>
//               <ul className="space-y-4">
//                 {teacher.achievements.map((achievement, idx) => (
//                   <li key={idx} className="flex items-start gap-3">
//                     <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
//                       <Award className="w-3.5 h-3.5 text-accent" />
//                     </div>
//                     <span className="text-text-secondary">{achievement}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Contact Info */}
//             <div className="bg-card rounded-xl p-6 border border-border">
//               <h3 className="text-xl font-bold text-text-primary mb-4">
//                 Contact Information
//               </h3>
//               <div className="space-y-4">
//                 <div className="flex items-start gap-3">
//                   <Mail className="w-5 h-5 text-primary mt-0.5" />
//                   <div>
//                     <p className="text-xs text-text-secondary mb-1">Email</p>
//                     <a
//                       href={`mailto:${teacher.email}`}
//                       className="text-text-primary hover:text-primary transition-colors break-all"
//                     >
//                       {teacher.email}
//                     </a>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <Phone className="w-5 h-5 text-primary mt-0.5" />
//                   <div>
//                     <p className="text-xs text-text-secondary mb-1">Phone</p>
//                     <a
//                       href={`tel:${teacher.phone}`}
//                       className="text-text-primary hover:text-primary transition-colors"
//                     >
//                       {teacher.phone}
//                     </a>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <MapPin className="w-5 h-5 text-primary mt-0.5" />
//                   <div>
//                     <p className="text-xs text-text-secondary mb-1">Office</p>
//                     <p className="text-text-primary">
//                       {teacher.officeLocation}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Office Hours */}
//             <div className="bg-secondary/10 rounded-xl p-6 border border-secondary/20">
//               <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
//                 <Calendar className="w-5 h-5 text-secondary" />
//                 Office Hours
//               </h3>
//               <p className="text-text-secondary">{teacher.officeHours}</p>
//               <button className="w-full mt-4 bg-secondary text-white py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
//                 Schedule Meeting
//               </button>
//             </div>

//             {/* Subjects Taught */}
//             <div className="bg-card rounded-xl p-6 border border-border">
//               <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
//                 <BookOpen className="w-5 h-5 text-primary" />
//                 Subjects Taught
//               </h3>
//               <ul className="space-y-2">
//                 {teacher.subjects.map((subject, idx) => (
//                   <li
//                     key={idx}
//                     className="flex items-center gap-2 text-text-secondary"
//                   >
//                     <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
//                     {subject}
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Joined Date */}
//             <div className="bg-card rounded-xl p-6 border border-border">
//               <h3 className="text-xl font-bold text-text-primary mb-2">
//                 Joined
//               </h3>
//               <p className="text-text-secondary">
//                 Member since {teacher.joinedDate}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
