import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { articles, newsCategories } from "../../../data/news";
import { formatDate } from "../../../utils/newsUtils";
import { Facebook, Twitter, MessageCircle, Send, Link2 } from "lucide-react";

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const article = articles.find((a) => a.id === parseInt(id || "0"));

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            {lang === "en"
              ? "Article Not Found"
              : lang === "da"
                ? "مقاله یافت نشد"
                : "مقاله و نه موندل شوه"}
          </h1>
          <Link to="/news" className="btn-primary inline-block">
            {t("news.backToNews")}
          </Link>
        </div>
      </div>
    );
  }

  const category = newsCategories.find((cat) => cat.id === article.category_id);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px]">
        <img
          src={article.image}
          alt={article.title[lang]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-45 left-5 md:top-60 md:left-55 bg-card/90 backdrop-blur-sm text-text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        {t("news.backToNews")}
      </button>
      {/* Content Section */}
      <div className="container mx-auto px-4 max-w-6xl -mt-40 relative z-10 pb-20">
        <article className="bg-card rounded-3xl shadow-2xl p-8 md:p-12 border border-border">
          {/* Category Badge */}
          {category && (
            <div className="mb-6">
              <span className="badge badge-primary px-5 py-2 text-base font-semibold">
                {category.name[lang]}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6 leading-tight">
            {article.title[lang]}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 pb-6 mb-8 border-b border-border">
            <div className="flex items-center gap-2 text-text-secondary">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              <span className="font-medium">{article.author}</span>
            </div>
            <div className="flex items-center gap-2 text-text-secondary">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{formatDate(article.date, lang)}</span>
            </div>
          </div>

          {/* Excerpt */}
          <div className="bg-surface p-6 rounded-2xl mb-8 border-l-4 border-primary">
            <p className="text-xl text-text-primary font-medium italic">
              {article.excerpt[lang]}
            </p>
          </div>

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-text-primary leading-relaxed whitespace-pre-line">
              {article.content[lang]}
            </p>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-4 sm:gap-6 mt-12 pt-6 border-t border-border">
            <span className="text-text-secondary font-medium sm:mr-2">
              {t("Sha")}
            </span>

            <div className="flex flex-wrap gap-4">
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors duration-300"
              >
                <Facebook size={18} />
                <span className="hidden md:inline">Facebook</span>
              </a>

              {/* Twitter/X */}
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors duration-300"
              >
                <Twitter size={18} />
                <span className="hidden md:inline">X</span>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors duration-300"
              >
                <MessageCircle size={18} />
                <span className="hidden md:inline">WhatsApp</span>
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors duration-300"
              >
                <Send size={18} />
                <span className="hidden md:inline">Telegram</span>
              </a>

              {/* Copy Link */}
              <button
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
                className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors duration-300"
              >
                <Link2 size={18} />
                <span className="hidden md:inline">Copy</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
