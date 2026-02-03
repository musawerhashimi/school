import { useTranslation } from "react-i18next";
import { TESTIMONIALS_DATA } from "../../data/testmonial";

export default function TestimonialsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {t("testimonialsHeading")}
          </h2>
          <p className="text-xl text-text-secondary">
            {t("testimonialsSubheading")}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-lg font-bold text-text-primary">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-text-secondary italic leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
