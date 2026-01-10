// Generate consistent color for a subject using hash
export default function generateSubjectColor(subject: string): string {
  // Simple hash function to generate consistent colors
  let hash = 0;
  for (let i = 0; i < subject.length; i++) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Color palette with good contrast
  const colors = [
    "bg-blue-50 border-blue-200 text-blue-900",
    "bg-purple-50 border-purple-200 text-purple-900",
    "bg-green-50 border-green-200 text-green-900",
    "bg-amber-50 border-amber-200 text-amber-900",
    "bg-red-50 border-red-200 text-red-900",
    "bg-orange-50 border-orange-200 text-orange-900",
    "bg-teal-50 border-teal-200 text-teal-900",
    "bg-indigo-50 border-indigo-200 text-indigo-900",
    "bg-lime-50 border-lime-200 text-lime-900",
    "bg-emerald-50 border-emerald-200 text-emerald-900",
    "bg-cyan-50 border-cyan-200 text-cyan-900",
    "bg-pink-50 border-pink-200 text-pink-900",
    "bg-rose-50 border-rose-200 text-rose-900",
    "bg-violet-50 border-violet-200 text-violet-900",
    "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-900",
  ];

  // Use hash to pick a color consistently
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}
