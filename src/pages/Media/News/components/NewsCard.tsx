import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { Article, NewsCategory } from "../../../../entities/NewsType";
import { getReadingTime, getRelativeTime } from "../../../../utils/newsUtils";

interface NewsCardProps {
  article: Article;
  categories: NewsCategory[];
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  categories,
  featured = false,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  const category = categories.find((cat) => cat.id === article.category_id);
  const readingTime = getReadingTime(article.content[lang]);

  return (
    <article
      className={`group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-500 col-span-1"
      }`}
    >
      <Link to={`/news/${article.id}`} className="block">
        {/* Image */}
        <div className=" relative overflow-hidden aspect-video">
          <img
            src={article.image}
            alt={article.title[lang]}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge */}
          {category && (
            <div className="absolute top-4 left-4">
              <span className="badge badge-primary px-4 py-2 text-sm font-semibold backdrop-blur-sm bg-primary/90">
                {category.name[lang]}
              </span>
            </div>
          )}

          {/* Featured Badge */}
          {article.featured && (
            <div className="absolute top-4 right-4">
              <span className="badge bg-accent text-text-primary px-4 py-2 text-sm font-bold backdrop-blur-sm">
                ⭐{" "}
                {lang === "en" ? "Featured" : lang === "da" ? "ویژه" : "ځانګړې"}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 ">
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              {article.author}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {getRelativeTime(article.date, lang)}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {readingTime}{" "}
              {lang === "en" ? "min read" : lang === "da" ? "دقیقه" : "دقیقې"}
            </span>
          </div>

          {/* Title */}
          <h3
            className={`font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2 ${
              featured ? "text-3xl" : "text-xl"
            }`}
          >
            {article.title[lang]}
          </h3>

          {/* Excerpt */}
          <p
            className={`text-text-secondary mb-4 line-clamp-3 ${featured ? "text-lg" : ""}`}
          >
            {article.excerpt[lang]}
          </p>

          {/* Footer */}
          <div className=" flex items-center justify-between pt-4 border-t border-border">
            <span className="text-primary font-semibold flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
              {t("news.readMore")}
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
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
};
