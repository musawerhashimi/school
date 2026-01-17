import { Calendar, Clock, MapPin, Users } from "lucide-react";
import type { Trip } from "../../../entities/EducationalTrips";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { TripCardSkeleton } from "./Skilton";

export default function TripCard({ trip }: { trip?: Trip }) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !trip) {
    return <TripCardSkeleton />;
  }

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming: "bg-info-soft text-info border-info",
      ongoing: "bg-warning-soft text-warning border-warning",
      completed: "bg-success-soft text-success border-success",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-surface text-text-secondary border-border"
    );
  };

  return (
    <div className="flex gap-6 md:gap-8 group">
      <div className="flex-1 pb-12">
        <div className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500">
          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
            <img
              src={trip.images}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? "scale-100 opacity-100" : "scale-110 opacity-0"
              } group-hover:scale-110`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="absolute top-4 left-4 flex gap-2">
              <span
                className={`badge border backdrop-blur-sm bg-white/90 ${getStatusColor(trip.status)} font-semibold shadow-lg`}
              >
                {trip.status}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-2xl font-bold text-text-primary mb-3 group-hover:text-primary transition-colors duration-300">
              {trip.title[lang]}
            </h3>

            <p className="text-text-secondary mb-4 leading-relaxed">
              {trip.description[lang]}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start gap-3 group/item">
                <div className="p-2 bg-surface rounded-lg group-hover/item:bg-primary/10 transition-colors duration-300">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                    {t("educationalTrips.location")}
                  </p>
                  <p className="text-text-primary font-medium">
                    {trip.location[lang]}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group/item">
                <div className="p-2 bg-surface rounded-lg group-hover/item:bg-primary/10 transition-colors duration-300">
                  <Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                    {t("educationalTrips.duration")}
                  </p>
                  <p className="text-text-primary font-medium">
                    {trip.duration} Day
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group/item">
                <div className="p-2 bg-surface rounded-lg group-hover/item:bg-primary/10 transition-colors duration-300">
                  <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                    Date
                  </p>
                  <p className="text-text-primary font-medium">
                    {new Date(trip.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 group/item">
                <div className="p-2 bg-surface rounded-lg group-hover/item:bg-primary/10 transition-colors duration-300">
                  <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                    {t("educationalTrips.gradeLevels")}
                  </p>
                  <p className="text-text-primary font-medium">
                    Grades {trip.gradeLevels}
                  </p>
                </div>
              </div>
            </div>

            {trip.participants && (
              <div className="flex items-center gap-2 pt-4 mt-4 border-t border-border text-text-secondary">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium">
                  <strong className="text-text-primary">
                    {trip.participants}
                  </strong>{" "}
                  {t("educationalTrips.participants")}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
