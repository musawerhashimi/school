import { useTranslation } from "react-i18next";

// CTA Section
function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="py-20 bg-gradient-to-r from-primary to-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {t("cta.readyToJoin")}
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          {t("cta.description")}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="/contact"
            className="px-8 py-4 bg-accent hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {t("involvement.cta.primaryButton")}
          </a>

          <a
            href="/academic-programs"
            className="px-8 py-4 bg-primary  hover:bg-accent text-white font-semibold rounded-xl border border-secondary transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {t("acd")}
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
