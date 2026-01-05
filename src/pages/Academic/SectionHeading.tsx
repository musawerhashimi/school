interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : ""}`}>
      <h2 className="text-4xl font-bold text-text-primary mb-3">{title}</h2>
      {subtitle && (
        <p className="text-lg text-text-secondary max-w-3xl">{subtitle}</p>
      )}
    </div>
  );
}
