import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { leadershipData } from "../../data/aboutPageData";
import { Link } from "react-router-dom";

export default function LeadershipSection() {
  const { t } = useTranslation();

  return (
    <section className="py-10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            {t("about.leadership.title")}
          </h2>
          <p className="text-xl text-text-secondary">
            {t("about.leadership.subtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {leadershipData.map((leader, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-text-primary mb-1">
                  {leader.name}
                </h3>
                <p className="text-primary font-semibold mb-3">{leader.role}</p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {leader.bio}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-16">
          <Link
            to="/team"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary via-accent to-secondary text-white px-10 py-4 rounded-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
          >
            <span className="font-semibold text-lg">
              {t("about.leadership.viewMore")}
            </span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
