import { Play, Calendar } from "lucide-react";
import type {
  GalleryItem,
  GalleryCategory,
} from "../../../entities/gallerytype";

interface GalleryCardProps {
  item: GalleryItem;
  categories: GalleryCategory[];
  featured?: boolean;
  onClick: () => void;
  index: number;
  currentLang: "en" | "pa" | "da";
}

export default function GalleryCard({
  item,
  categories,
  onClick,
  index,
  currentLang,
}: GalleryCardProps) {
  // Get the category name for display from API categories
  const getCategoryName = (categoryId: number): string => {
    const category = categories.find((cat) => cat.category_id === categoryId);
    return category ? category.name[currentLang] : "";
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-card shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer`}
      onClick={onClick}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {/* Image/Video Thumbnail */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={item.thumbnailUrl}
          alt={item.title[currentLang]}
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
          {item.title[currentLang]}
        </h3>
        <p className="text-sm text-gray-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {item.description[currentLang]}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Calendar className="w-3 h-3" />
          <span>{new Date(item.date).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Category Badge */}
      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-white text-xs font-medium">
        {getCategoryName(item.category)}
      </div>
    </div>
  );
}
