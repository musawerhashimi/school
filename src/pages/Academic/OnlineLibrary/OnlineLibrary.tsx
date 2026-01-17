import { Search, X, Eye, BookOpen, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { bookCategories, booksData } from "../../../data/online_library";
import BookSkeleton from "./BookSkilton";
import { t } from "i18next";

export default function OnlineLibrary() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Get category by ID
  const getCategoryById = (categoryId: number) => {
    return bookCategories.find((cat) => cat.id === categoryId);
  };

  // Filter books
  const filteredBooks = booksData.filter((book) => {
    // Search filter (by title only)
    const matchesSearch = book.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    // Time filter (new = 2022 or later, old = before 2022)
    let matchesTimeFilter = true;
    if (selectedFilter === "new") {
      matchesTimeFilter = book.publicationYear >= 2022;
    } else if (selectedFilter === "old") {
      matchesTimeFilter = book.publicationYear < 2022;
    }

    // Category filter
    const matchesCategory =
      selectedCategory === null || book.category_id === selectedCategory;

    return matchesSearch && matchesTimeFilter && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-bl from-surface to-info-soft border-b border-border ">
        <div className="max-w-7xl mx-auto px-6 py-16 ">
          <div className="text-center mt-8">
            <h1 className="text-5xl font-light text-text-primary mb-4">
              {t("library.title")}
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {t("library.subtitle")}
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-background border-b border-border z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-wrap items-center gap-4 justify-center">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary w-5 h-5" />
              <input
                type="text"
                placeholder={t("library.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-surface text-text-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-primary hover:text-text-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* All Books Button */}
            <button
              onClick={() => {
                setSelectedFilter("all");
                setSelectedCategory(null);
              }}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                selectedFilter === "all" && selectedCategory === null
                  ? "bg-primary text-white shadow-md"
                  : "bg-surface text-text-secondary border border-border hover:border-primary"
              }`}
            >
              {t("library.action.allBooks")}
            </button>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
                }
                className={`px-6 py-2.5 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory !== null
                    ? "bg-primary-dark text-white shadow-md"
                    : "bg-card text-text-secondary border border-border hover:border-primary"
                }`}
              >
                {selectedCategory !== null
                  ? getCategoryById(selectedCategory)?.name
                  : t("library.action.byCategory")}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isCategoryDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute top-full mt-2 left-0 bg-card rounded-2xl shadow-xl border border-border py-2 min-w-[200px] z-20">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedFilter("all");
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-surface-hover font-medium"
                  >
                    {t("library.action.allCategories")}
                  </button>
                  <div className="border-t border-border my-1" />
                  {bookCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedFilter("all");
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-surface-hover flex items-center gap-2"
                    >
                      <span className="font-medium">{category.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="md:mx-6  px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
              <BookSkeleton key={index} />
            ))}
          </div>
        ) : filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBooks.map((book) => {
              const category = getCategoryById(book.category_id);
              return (
                <div
                  key={book.id}
                  className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-border"
                >
                  {/* Book Cover */}
                  <div className="relative overflow-hidden h-80 bg-surface">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-text-primary mb-2 line-clamp-2 leading-tight">
                      {book.title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      {book.author}
                    </p>
                    <p className="text-sm text-muted line-clamp-2 mb-4 leading-relaxed">
                      {book.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {category && (
                        <span
                          className={`px-3 py-1 bg-accent text-xs rounded-full font-medium`}
                        >
                          {category.name}
                        </span>
                      )}
                      <span className="px-3 py-1 bg-surface text-text-secondary text-xs rounded-full font-medium">
                        {book.language}
                      </span>
                      <span className="px-3 py-1 bg-surface text-muted text-xs rounded-full font-medium">
                        {book.publicationYear}
                      </span>
                    </div>

                    {/* Action Button */}
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors group-hover:shadow-md">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">
                        {t("library.action.view")}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <BookOpen className="w-20 h-20 mx-auto text-muted mb-6" />
            <p className="text-2xl text-text-secondary font-light">
              No books found
            </p>
            <p className="text-muted mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
