// Info Item Component
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}
export default function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-3">
      <div className="flex items-center gap-2 text-muted mb-1">
        <div className="w-4 h-4">{icon}</div>
        <span className="text-xs font-medium uppercase">{label}</span>
      </div>
      <p className="text-text-primary pt-2 font-medium">{value}</p>
    </div>
  );
}
