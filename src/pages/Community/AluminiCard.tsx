// src/components/alumni/AlumniCard.tsx

import React from "react";
import { useTranslation } from "react-i18next";

import { Mail, GraduationCap, Award, Trophy } from "lucide-react";
import type { Alumni } from "../../entities/Alumini";

interface AlumniCardProps {
  alumni: Alumni;
}

export const AlumniCard: React.FC<AlumniCardProps> = ({ alumni }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "da" | "pa";

  return (
    <div className="card group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Alumni Image */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={alumni.image}
          alt={alumni.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          <GraduationCap className="inline-block w-4 h-4 mr-1" />
          {alumni.graduatedYear}
        </div>
        <div className="absolute top-3 left-3 bg-accent text-text-primary px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          <Trophy className="inline-block w-4 h-4 mr-1" />
          {alumni.gradeLevel}
        </div>
      </div>

      {/* Alumni Info */}
      <div className="space-y-3">
        {/* Name */}
        <h3 className="text-2xl font-bold text-text-primary group-hover:text-primary transition-colors duration-300">
          {alumni.name}
        </h3>

        {/* Quote */}
        <div className="bg-surface p-4 rounded-lg border-l-4 border-primary">
          <p className="text-sm italic text-text-secondary leading-relaxed">
            "{alumni.quote[lang]}"
          </p>
        </div>

        {/* Achievements */}
        <div className="pt-3 border-t border-border">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-primary" />
            <h4 className="font-semibold text-text-primary">
              {t("KeyAchievements")}
            </h4>
          </div>
          <ul className="space-y-2">
            {alumni.achievements.map((achievement, index) => (
              <li
                key={index}
                className="text-sm text-text-secondary leading-relaxed ps-4 relative before:content-['•'] before:absolute before:start-0 before:text-primary before:font-bold"
              >
                {achievement[lang]}
              </li>
            ))}
          </ul>
        </div>

        {/* Email */}
        {alumni.email && (
          <div className="pt-3">
            <a
              href={`mailto:${alumni.email}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-accent hover:text-white transition-all duration-300 text-text text-sm font-medium"
            >
              <Mail className="w-4 h-4" />
              <span>{t("email")}</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
