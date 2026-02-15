import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHome } from "./Api/useHome";
import Loader from "../../components/Loader";

export default function HeroSlider() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "en" | "da" | "pa";
  const [currentSlide, setCurrentSlide] = useState(0);
  const { homeData, isLoading, error } = useHome();

  const slides = homeData?.sliders || [];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (isLoading) {
    return (
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader />
          <p className="mt-4 text-lg text-text-secondary">{t("Loading...")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {t("Error")}
          </h2>
          <p className="text-text-secondary mb-4">
            {t("Failed to load slider data")}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
          >
            {t("Try Again")}
          </button>
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-md px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {t("No Slides")}
          </h2>
          <p className="text-text-secondary">{t("No slider data available")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden ">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/6 via-background/60 to-transparent z-10" />

          <img
            src={slide.image}
            alt={slide.title[currentLang]}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-4 animate-fade-in">
                  {slide.title[currentLang]}
                </h1>
                <p className="text-2xl md:text-3xl text-accent font-semibold mb-4">
                  {slide.subtitle[currentLang]}
                </p>
                <p className="text-lg md:text-xl text-text-secondary mb-8">
                  {slide.description[currentLang]}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="/academic-programs"
                    className="px-8 py-4 bg-primary  hover:bg-accent text-white font-semibold rounded-xl border border-secondary transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    {t("acd")}
                  </a>
                  <a
                    href="/about"
                    className="px-8 py-4 bg-accent hover:bg-surface-hover text-text-primary font-semibold rounded-xl border border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    {t("community.cta.learnMore")}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-primary w-8" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
