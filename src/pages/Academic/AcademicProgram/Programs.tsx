import { Search } from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { academicPrograms } from "../../../data/acadimicdata";
import type { Program } from "../../../entities/program";
import SectionHeading from "./SectionHeading";
import { useTranslation } from "react-i18next";
import ProgramCard from "./ProgramCard";

export default function Programs() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate(); // Add this
  const { t } = useTranslation();

  const filteredPrograms = academicPrograms.filter(
    (program) =>
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.subjects.some((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const handleProgramClick = (program: Program) => {
    navigate("/academic-programs/program-details", {
      state: { program },
    });
  };

  return (
    <>
      <div className="mb-12">
        <SectionHeading
          title={t("academic.programs.section.title")}
          subtitle={t("academic.programs.section.subtitle")}
        />

        <div className="relative max-w-7xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder={t("academic.programs.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm hover:shadow-md"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-1 gap-8">
        {filteredPrograms.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onClick={() => handleProgramClick(program)}
          />
        ))}
      </div>
      {filteredPrograms.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">
            {t("academic.programs.noResults")}
          </p>
        </div>
      )}
    </>
  );
}
