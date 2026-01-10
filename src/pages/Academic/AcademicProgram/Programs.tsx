import { Search } from "lucide-react";
import ProgramCard from "./ProgramCard";
import { useState } from "react";
import { academicPrograms } from "../../../data/acadimicdata";
import type { Program } from "../../../entities/program";
import ProgramDetailModal from "./ProgramDetailModal";

export default function Programs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const filteredPrograms = academicPrograms.filter(
    (program) =>
      program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      program.subjects.some((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <>
      <div className="mb-12">
        <div className="relative max-w-7xl">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
          <input
            type="text"
            placeholder="Search programs, subjects, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-surface border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-1 gap-8">
        {filteredPrograms.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            onClick={() => setSelectedProgram(program)}
          />
        ))}
      </div>

      {filteredPrograms.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg">
            No programs found matching your search.
          </p>
        </div>
      )}

      {selectedProgram && (
        <ProgramDetailModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </>
  );
}
