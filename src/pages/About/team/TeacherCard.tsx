import { GraduationCap, Briefcase } from "lucide-react";
import type { TeamMember } from "../../../entities/teachers";

type TeamCardProps = {
  member: TeamMember;
  onClick?: () => void;
};

// Team Card Component
export default function TeamCard({ member, onClick }: TeamCardProps) {
  const isTeacher = member.type === "teacher";

  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="relative h-64 overflow-hidden bg-surface">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white font-bold text-xl mb-1">{member.name}</h3>
          <p className="text-white/90 text-sm">{member.role}</p>
        </div>
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isTeacher ? "bg-blue-500 text-white" : "bg-green-500 text-white"
            }`}
          >
            {isTeacher ? "Teacher" : "Staff"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 text-primary mb-3">
          {isTeacher ? (
            <GraduationCap className="w-4 h-4" />
          ) : (
            <Briefcase className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{member.department}</span>
        </div>

        {isTeacher && member.subjects && (
          <div className="flex flex-wrap gap-2 mb-4">
            {member.subjects.slice(0, 2).map((subject, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-medium"
              >
                {subject}
              </span>
            ))}
            {member.subjects.length > 2 && (
              <span className="px-3 py-1 bg-surface text-text-secondary rounded-full text-xs font-medium">
                +{member.subjects.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="space-y-2 text-sm text-text-secondary mb-4">
          <div className="flex items-center gap-2">
            <span className="truncate">{member.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{member.experience} experience</span>
          </div>
        </div>

        <button className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          View Profile
        </button>
      </div>
    </div>
  );
}
