import {
  X,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import type { GalleryItem } from "../../../entities/gallerytype";

interface LightboxProps {
  item: GalleryItem;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  hasNext: boolean;
  hasPrev: boolean;
  currentLang: "en" | "pa" | "da";
}

export default function Lightbox({
  item,
  onClose,
  onNavigate,
  hasNext,
  hasPrev,
  currentLang,
}: LightboxProps) {
  const { t } = useTranslation();
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate("prev");
      if (e.key === "ArrowRight" && hasNext) onNavigate("next");
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [onClose, onNavigate, hasNext, hasPrev]);

  // Reset zoom when item changes
  useEffect(() => {
    setIsZoomed(false);
    setImageLoaded(false);
  }, [item.id]);

  const handleDownload = async () => {
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.title[currentLang]}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(item.url, "_blank");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/80 to-transparent pt-6 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-end gap-3">
          {/* Zoom Toggle (Image only) */}
          {item.type === "image" && imageLoaded && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(!isZoomed);
              }}
              className="p-3 rounded-xl bg-surface hover:bg-surface-hover border border-border text-text-primary transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              aria-label={isZoomed ? "Zoom out" : "Zoom in"}
            >
              {isZoomed ? (
                <ZoomOut className="w-5 h-5" />
              ) : (
                <ZoomIn className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Download Button */}
          {item.type === "image" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="p-3 rounded-xl bg-primary hover:bg-primary-dark border border-primary text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              aria-label={t("gallery.download")}
            >
              <Download className="w-5 h-5" />
            </button>
          )}

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-3 rounded-xl bg-danger/10 hover:bg-danger/20 border border-danger/30 text-danger hover:text-danger transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:rotate-90"
            aria-label={t("gallery.close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation Buttons */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("prev");
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-4 rounded-xl bg-surface hover:bg-surface-hover border border-border text-text-primary transition-all duration-300 hover:scale-105 active:scale-95 hover:-translate-x-1 shadow-xl group"
          aria-label={t("gallery.previous")}
        >
          <ChevronLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("next");
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-4 rounded-xl bg-surface hover:bg-surface-hover border border-border text-text-primary transition-all duration-300 hover:scale-105 active:scale-95 hover:translate-x-1 shadow-xl group"
          aria-label={t("gallery.next")}
        >
          <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
        </button>
      )}

      {/* Content Container */}
      <div
        className="relative max-w-7xl w-full h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center py-20"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "image" ? (
          /* IMAGE DISPLAY */
          <div className="relative group">
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-surface rounded-2xl animate-pulse" />
            )}

            <div className="relative">
              <img
                src={item.url}
                alt={item.title[currentLang]}
                onLoad={() => setImageLoaded(true)}
                className={`max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl transition-all duration-500 ${
                  isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
                } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                onClick={() => setIsZoomed(!isZoomed)}
              />

              {/* Description Overlay at Bottom */}
              {imageLoaded && !isZoomed && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent rounded-b-2xl p-6 sm:p-8 transform translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
                    {item.title[currentLang]}
                  </h2>
                  <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-4">
                    {item.description[currentLang]}
                  </p>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm text-text-primary font-medium">
                        {new Date(item.date).toLocaleDateString(
                          currentLang === "en"
                            ? "en-US"
                            : currentLang === "pa"
                              ? "ps-AF"
                              : "fa-AF",
                          { year: "numeric", month: "long", day: "numeric" },
                        )}
                      </span>
                    </div>

                    {item.photographer && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
                        <User className="w-4 h-4 text-secondary" />
                        <span className="text-sm text-text-secondary">
                          {t("gallery.photoBy")}
                        </span>
                        <span className="text-sm text-text-primary font-medium">
                          {item.photographer}
                        </span>
                      </div>
                    )}

                    <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* VIDEO DISPLAY */
          <div className="w-full max-w-5xl max-h-[85vh] overflow-y-auto scrollbar-hide">
            <div className="flex flex-col gap-6">
              {/* Video Player */}
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border flex-shrink-0">
                <iframe
                  src={item.url}
                  className="w-full h-full"
                  allowFullScreen
                  title={item.title[currentLang]}
                />
              </div>

              {/* Video Description - Always Visible */}
              <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg flex-shrink-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3">
                  {item.title[currentLang]}
                </h2>
                <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-4">
                  {item.description[currentLang]}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm text-text-primary font-medium">
                      {new Date(item.date).toLocaleDateString(
                        currentLang === "en"
                          ? "en-US"
                          : currentLang === "pa"
                            ? "ps-AF"
                            : "fa-AF",
                        { year: "numeric", month: "long", day: "numeric" },
                      )}
                    </span>
                  </div>

                  {item.photographer && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
                      <User className="w-4 h-4 text-secondary" />
                      <span className="text-sm text-text-secondary">
                        {t("gallery.photoBy")}
                      </span>
                      <span className="text-sm text-text-primary font-medium">
                        {item.photographer}
                      </span>
                    </div>
                  )}

                  <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      {item.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
