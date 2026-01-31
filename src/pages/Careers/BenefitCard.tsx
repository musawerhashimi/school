// Benefit Card Component
interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
}
export default function BenefitCard({
  icon,
  title,
  description,
}: BenefitCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}
