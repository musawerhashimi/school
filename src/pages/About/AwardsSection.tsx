import { ArrowRight, Award, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { awardsData, totalaward } from "../../data/aboutPageData";

export default function AwardsSection() {
  const { t } = useTranslation();

  return (
    <section className="py-10 bg-gradient-to-b from-surface to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent to-primary rounded-2xl mb-6">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {t("about.awards.title")}
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            {t("about.awards.subtitle")}
          </p>
        </div>

        {/* Awards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {awardsData.map((award, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={award.image}
                  alt={award.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                {/* Year Badge */}
                <div className="absolute top-4 right-4 flex items-center space-x-2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span className="text-sm font-bold text-text-primary">
                    {award.year}
                  </span>
                </div>

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-accent to-primary text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {award.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-accent transition-colors duration-300">
                  {award.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {award.description}
                </p>
              </div>

              {/* Hover Effect Border */}
              <div className="h-1 bg-gradient-to-r from-accent via-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-16">
          <a
            href="/"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary via-accent to-secondary text-white px-10 py-4 rounded-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <span className="font-semibold text-lg">
              {t("about.awards.viewMore")}
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="text-4xl font-bold text-accent mb-2">
              {totalaward.Total_Awards}
            </div>
            <div className="text-text-secondary text-sm">
              {" "}
              {t("about.awards.stats.totalAwards")}
            </div>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="text-4xl font-bold text-primary mb-2">
              {totalaward.YearsOf_Excellence}
            </div>
            <div className="text-text-secondary text-sm">
              {t("about.awards.stats.years")}
            </div>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="text-4xl font-bold text-secondary mb-2">
              {totalaward.National_Awards}
            </div>
            <div className="text-text-secondary text-sm">
              {t("about.awards.stats.national")}
            </div>
          </div>
          <div className="text-center p-6 bg-card border border-border rounded-xl">
            <div className="text-4xl font-bold text-accent mb-2">
              {totalaward.International_Awards}
            </div>
            <div className="text-text-secondary text-sm">
              {t("about.awards.stats.international")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
