import React, { useState, useMemo } from "react";
import {
  Search,
  X,
  Download,
  Play,
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";

// ============================================================================
// TypeScript Interfaces for API Integration
// ============================================================================

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  type: "image" | "video";
  url: string;
  thumbnailUrl: string;
  category: GalleryCategory;
  date: string;
  photographer?: string;
  tags: string[];
  featured?: boolean;
}

export type GalleryCategory =
  | "all"
  | "academic"
  | "sports"
  | "cultural"
  | "projects"
  | "ceremonies"
  | "trips"
  | "achievements";

export interface GalleryApiResponse {
  items: GalleryItem[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// Mock Data (Replace with API calls)
// ============================================================================

const mockGalleryItems: GalleryItem[] = [
  {
    id: "1",
    title: "Science Fair 2024",
    description: "Students presenting innovative science projects",
    type: "image",
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400",
    category: "academic",
    date: "2024-11-15",
    photographer: "John Doe",
    tags: ["science", "innovation", "students"],
    featured: true,
  },
  {
    id: "2",
    title: "Annual Sports Day",
    description: "Students competing in track and field events",
    type: "image",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400",
    category: "sports",
    date: "2024-10-20",
    tags: ["sports", "competition", "athletics"],
    featured: true,
  },
  {
    id: "3",
    title: "Cultural Performance",
    description: "Traditional dance performance by students",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
    category: "cultural",
    date: "2024-09-10",
    tags: ["dance", "culture", "performance"],
  },
  {
    id: "4",
    title: "Robotics Workshop",
    description: "Students learning robotics and programming",
    type: "image",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400",
    category: "projects",
    date: "2024-11-01",
    tags: ["robotics", "technology", "workshop"],
  },
  {
    id: "5",
    title: "Graduation Ceremony 2024",
    description: "Celebrating our graduating class",
    type: "image",
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
    category: "ceremonies",
    date: "2024-06-15",
    tags: ["graduation", "ceremony", "celebration"],
    featured: true,
  },
  {
    id: "6",
    title: "Art Exhibition",
    description: "Student artwork on display",
    type: "image",
    url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400",
    category: "cultural",
    date: "2024-08-22",
    tags: ["art", "exhibition", "creativity"],
  },
  {
    id: "7",
    title: "Basketball Championship",
    description: "Our team winning the regional championship",
    type: "image",
    url: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
    category: "sports",
    date: "2024-11-28",
    tags: ["basketball", "championship", "victory"],
  },
  {
    id: "8",
    title: "Field Trip to Museum",
    description: "Students exploring historical artifacts",
    type: "image",
    url: "https://images.unsplash.com/photo-1565301660306-29e08751cc53?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1565301660306-29e08751cc53?w=400",
    category: "trips",
    date: "2024-10-05",
    tags: ["field trip", "museum", "history"],
  },
  {
    id: "9",
    title: "Math Olympiad Winners",
    description: "Students receiving awards for excellence in mathematics",
    type: "image",
    url: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    category: "achievements",
    date: "2024-11-10",
    tags: ["mathematics", "awards", "olympiad"],
  },
  {
    id: "10",
    title: "Chemistry Lab Session",
    description: "Hands-on chemistry experiments",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=400",
    category: "academic",
    date: "2024-09-20",
    tags: ["chemistry", "lab", "science"],
  },
  {
    id: "11",
    title: "Music Concert",
    description: "School orchestra performing classical pieces",
    type: "video",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400",
    category: "cultural",
    date: "2024-07-18",
    tags: ["music", "concert", "orchestra"],
  },
  {
    id: "12",
    title: "Environmental Project",
    description: "Students planting trees for sustainability",
    type: "image",
    url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400",
    category: "projects",
    date: "2024-10-12",
    tags: ["environment", "sustainability", "community"],
  },
];

// ============================================================================
// Gallery Component
// ============================================================================

const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<GalleryCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [theme] = useState<"light" | "dark">("light");

  // Category definitions
  const categories: { value: GalleryCategory; label: string; icon: string }[] =
    [
      { value: "all", label: "All", icon: "📚" },
      { value: "academic", label: "Academic", icon: "🎓" },
      { value: "sports", label: "Sports", icon: "⚽" },
      { value: "cultural", label: "Cultural", icon: "🎭" },
      { value: "projects", label: "Projects", icon: "🔬" },
      { value: "ceremonies", label: "Ceremonies", icon: "🎉" },
      { value: "trips", label: "Trips", icon: "🚌" },
      { value: "achievements", label: "Achievements", icon: "🏆" },
    ];

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
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return items;
  }, [selectedCategory, searchQuery]);

  const displayedItems = filteredItems.slice(0, itemsToShow);
  const hasMore = itemsToShow < filteredItems.length;

  // Navigate lightbox
  const navigateLightbox = (direction: "prev" | "next") => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(
      (item) => item.id === selectedItem.id
    );
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + filteredItems.length) % filteredItems.length
        : (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[newIndex]);
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-background text-text-primary"
          : "bg-surface text-text-primary"
      }`}
    >
      {/* Header */}
      <PageHeader
        title="Gallery"
        subtitle="Capturing moments of excellence at Sultan Zoy High School"
        image="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920"
        breadcrumb={["Home", "Gallery"]}
      />

      {/* Search and Filter Section */}
      <div className="sticky top-0 z-40 bg-card shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, description, or tags..."
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
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.value
                    ? "bg-primary text-white"
                    : "bg-surface text-text-primary hover:bg-border"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {cat.value === "all" && (
                  <span className="ml-1 text-xs opacity-75">
                    ({mockGalleryItems.length})
                  </span>
                )}
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
              No items found
            </h3>
            <p className="text-text-secondary">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-6 text-text-secondary">
              Showing {displayedItems.length} of {filteredItems.length} items
            </div>

            {/* Masonry Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedItems.map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  featured={item.featured && selectedCategory === "all"}
                  onClick={() => setSelectedItem(item)}
                  index={index}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setItemsToShow((prev) => prev + 12)}
                  className="px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  Load More
                </button>
              </div>
            )}
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
        />
      )}
    </div>
  );
};

// ============================================================================
// Gallery Card Component
// ============================================================================

interface GalleryCardProps {
  item: GalleryItem;
  featured?: boolean;
  onClick: () => void;
  index: number;
}

const GalleryCard: React.FC<GalleryCardProps> = ({
  item,
  featured,
  onClick,
  index,
}) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-card shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer ${
        featured ? "sm:col-span-2 sm:row-span-2" : ""
      }`}
      onClick={onClick}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Image/Video Thumbnail */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Video Play Icon */}
        {item.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all">
            <div className="w-16 h-16 rounded-full bg-white bg-opacity-90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-primary ml-1" fill="currentColor" />
            </div>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {item.title}
        </h3>
        <p className="text-sm text-gray-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {item.description}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Calendar className="w-3 h-3" />
          <span>{new Date(item.date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
        {item.category}
      </div>
    </div>
  );
};

// ============================================================================
// Lightbox Component
// ============================================================================

interface LightboxProps {
  item: GalleryItem;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  hasNext: boolean;
  hasPrev: boolean;
}

const Lightbox: React.FC<LightboxProps> = ({
  item,
  onClose,
  onNavigate,
  hasNext,
  hasPrev,
}) => {
  const handleDownload = () => {
    // In production, implement actual download logic
    window.open(item.url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-background bg-opacity-10 hover:bg-opacity-20 text-text-primary transition-all"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Download Button */}
      {item.type === "image" && (
        <button
          onClick={handleDownload}
          className="absolute top-4 right-16 z-50 p-2 rounded-full bg-secondary bg-opacity-10 hover:bg-opacity-20 text-white transition-all"
        >
          <Download className="w-6 h-6" />
        </button>
      )}

      {/* Navigation Buttons */}
      {hasPrev && (
        <button
          onClick={() => onNavigate("prev")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 p-3 rounded-full bg-background bg-opacity-10 hover:bg-opacity-20 text-text-primary transition-all"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={() => onNavigate("next")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 p-3 rounded-full bg-background bg-opacity-10 hover:bg-opacity-20 text-text-primary transition-all"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      )}

      {/* Content */}
      <div className="max-w-6xl w-full max-h-[90vh] flex flex-col">
        {/* Media */}
        <div className="flex-1 flex items-center justify-center mb-4">
          {item.type === "image" ? (
            <img
              src={item.url}
              alt={item.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          ) : (
            <div className="w-full aspect-video max-w-4xl">
              <iframe
                src={item.url}
                className="w-full h-full rounded-lg"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-background bg-opacity-10 backdrop-blur-md rounded-lg p-6 text-text-primary">
          <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
          <p className="text-gray-300 mb-4">{item.description}</p>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(item.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {item.photographer && (
              <div>
                <span className="text-gray-400">Photo by:</span>{" "}
                {item.photographer}
              </div>
            )}
          </div>

          {/* Tags */}
          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
