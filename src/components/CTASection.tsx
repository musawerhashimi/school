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
          <button className="px-8 py-4 bg-white text-primary hover:bg-surface rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
            {t("cta.applyNow")}
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-lg font-bold text-lg transition-all duration-200">
            {t("cta.scheduleTour")}
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
