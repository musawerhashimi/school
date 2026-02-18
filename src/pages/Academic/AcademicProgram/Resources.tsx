import { Download, FileText, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import SectionHeading from "./SectionHeading";
import { resouces } from "../../../data/acadimicdata";
import { Link } from "react-router-dom";

export default function Resources() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  return (
    <div>
      <SectionHeading
        title={t("academic.resources.title")}
        subtitle={t("academic.resources.subtitle")}
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resouces.map((resource, index: number) => (
          <div
            key={index}
            className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-7 h-7 text-white" />
                </div>

                <div className="flex-1">
                  <h3 className="font-bold text-lg text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {resource.title[lang]}
                  </h3>
                </div>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-6 line-clamp-3">
                {resource.description[lang]}
              </p>

              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />

              <button className="w-full bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-3 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3">
                <Download className="w-4 h-4" />
                {t("academic.resources.download")}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <div className="h-1 bg-gradient-to-r from-primary via-primary-dark to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <div className="mt-12 bg-gradient-to-br from-surface to-card border border-border rounded-xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-text-primary mb-4">
          {t("academic.resources.needMoreInfo")}
        </h3>

        <p className="text-text-secondary mb-6">
          {t("academic.resources.contactDescription")}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            to={"/contact"}
            className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            {t("academic.resources.contactOffice")}
          </Link>
        </div>
      </div>
    </div>
  );
}
