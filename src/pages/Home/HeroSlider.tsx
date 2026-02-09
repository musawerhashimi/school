import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { slides } from "../../data/home";

export default function HeroSlider() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "en" | "da" | "pa";
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
