import { useState, useMemo } from "react";
import { Search, X, Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageHeader from "../../../components/layout/PageHeader";
import type { GalleryItem } from "../../../entities/gallerytype";
import { categoryData, mockGalleryItems } from "../../../data/galleryData";
import GalleryCard from "./GalleryCard";
import Lightbox from "./LightboxModal";

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as "en" | "pa" | "da";

  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Filter and search logic
  const filteredItems = useMemo(() => {
    let items = mockGalleryItems;

    if (selectedCategory !== "all") {
      items = items.filter((item) => item.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title[currentLang].toLowerCase().includes(query) ||
          item.description[currentLang].toLowerCase().includes(query),
      );
    }

    return items;
  }, [selectedCategory, searchQuery, currentLang]);

  // Navigate lightbox
  const navigateLightbox = (direction: "prev" | "next") => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(
      (item) => item.id === selectedItem.id,
    );
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + filteredItems.length) % filteredItems.length
        : (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[newIndex]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PageHeader
        title={t("gallery.title")}
        subtitle={t("gallery.subtitle")}
        image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920"
        breadcrumb={[
          { name: t("nav.home"), path: "/" },
          { name: t("nav.media.gallery"), path: "" },
        ]}
      />

      {/* Search and Filter Section */}
      <div className="  z-40 bg-card shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-6xl ">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder={t("gallery.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-5 h-5 text-text-secondary flex-shrink-0" />

            {/* All Categories Button */}
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-white"
                  : "bg-surface text-text-primary hover:bg-border"
              }`}
            >
              <span>{t("gallery.all")}</span>
              <span className="ml-1 text-xs opacity-75">
                ({mockGalleryItems.length})
              </span>
            </button>

            {/* Category Buttons */}
            {categoryData.map((cat) => (
              <button
                key={cat.category_id}
                onClick={() => setSelectedCategory(cat.category_id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.category_id
                    ? "bg-primary text-white"
                    : "bg-surface text-text-primary hover:bg-border"
                }`}
              >
                <span>{cat.name[currentLang]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-text-primary mb-2">
              {t("gallery.noItemsFound")}
            </h3>
            <p className="text-text-secondary">{t("gallery.noItemsMessage")}</p>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6 text-text-secondary">
              {t("gallery.showing")} {mockGalleryItems.length} {t("gallery.of")}{" "}
              {filteredItems.length} {t("gallery.items")}
            </div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockGalleryItems.map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                  index={index}
                  currentLang={currentLang}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <Lightbox
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onNavigate={navigateLightbox}
          hasNext={filteredItems.length > 1}
          hasPrev={filteredItems.length > 1}
          currentLang={currentLang}
        />
      )}
    </div>
  );
}
