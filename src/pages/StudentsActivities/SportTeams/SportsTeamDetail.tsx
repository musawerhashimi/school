import { useMemo } from "react";

import {
  ArrowLeft,
  Award,
  Calendar,
  Users,
  MapPin,
  Trophy,
  Star,
  Mail,
} from "lucide-react";
import type { LanguageType } from "../../../entities/sportsTeams";
import { sportCategories, sportsTeams } from "../../../data/sportsTeams.data";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SportsTeamDetail = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as LanguageType;
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const team = useMemo(() => sportsTeams.find((t) => t.id === id), [id]);

  const category = useMemo(
    () => sportCategories.find((cat) => cat.id === team?.categoryId),
    [team],
  );

  if (!team) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            {t("sportsTeams.detail.teamNotFound")}
          </h2>
          <button
            onClick={() => {
              console.log("Navigate to /sports-teams");
            }}
            className="btn-primary inline-flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("sportsTeams.detail.backToTeams")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={team.image}
          alt={team.name[lang]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 " />

        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            {/* Professional Back Button */}
            <button
              onClick={() => navigate("/sports-teams")}
              className="my-4 group flex items-center gap-2 bg-white/10 backdrop-blur-md px-2 py-2 rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform duration-300" />
              </div>
              <span className="text-white font-medium text-sm tracking-wide">
                {t("sportsTeams.detail.backToTeams")}
              </span>
            </button>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-4 py-2 bg-primary text-white rounded-full font-semibold">
                {category?.name[lang]}
              </span>
              <span className="flex items-center text-white">
                <Calendar className="w-5 h-5 mr-2" />
                {t("sportsTeams.establishedIn")} {team.establishedYear}
              </span>
            </div>

            <h1 className="text-5xl font-bold text-white mb-4">
              {team.name[lang]}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Team */}
            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center">
                <Users className="w-6 h-6 mr-3 text-primary" />
                {t("sportsTeams.detail.aboutTeam")}
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {team.description[lang]}
              </p>
            </section>

            {/* Coach Information */}
            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                <Award className="w-6 h-6 mr-3 text-primary" />
                {t("sportsTeams.detail.coach")}
              </h2>

              <div className="flex items-start gap-6">
                <img
                  src={team.coach.photo}
                  alt={team.coach.name[lang]}
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-text-primary mb-2">
                    {team.coach.name[lang]}
                  </h3>
                  <p className="text-text-secondary mb-4">
                    <span className="font-semibold text-primary">
                      {t("sportsTeams.detail.experience")}:
                    </span>{" "}
                    {team.coach.experience[lang]}
                  </p>

                  {team.coach.certifications && (
                    <div>
                      <p className="font-semibold text-text-primary mb-2">
                        {t("sportsTeams.detail.certifications")}:
                      </p>
                      <ul className="list-disc list-inside text-text-secondary space-y-1">
                        {team.coach.certifications[lang].map((cert, idx) => (
                          <li key={idx}>{cert}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button className="btn-secondary flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {t("sportsTeams.detail.contactCoach")}
                </button>
              </div>
            </section>

            {/* Team Members */}
            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                <Users className="w-6 h-6 mr-3 text-primary" />
                {t("sportsTeams.detail.teamMembers")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {team.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-4 p-4 bg-surface rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    <img
                      src={member.photo}
                      alt={member.name[lang]}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-text-primary">
                        {member.name[lang]}
                      </h4>
                      <p className="text-sm text-text-secondary">
                        {member.position[lang]}
                      </p>
                    </div>
                    {member.jerseyNumber && (
                      <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold">
                        {member.jerseyNumber}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Achievements */}
            <section className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6 flex items-center">
                <Trophy className="w-6 h-6 mr-3 text-accent" />
                {t("sportsTeams.detail.teamAchievements")}
              </h2>

              {team.achievements.length === 0 ? (
                <p className="text-text-secondary text-center py-8">
                  {t("sportsTeams.detail.noAchievements")}
                </p>
              ) : (
                <div className="space-y-6">
                  {team.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex gap-4 p-6 bg-surface rounded-xl border-l-4 border-accent hover:shadow-lg transition-all duration-300"
                    >
                      <div className="text-4xl">{achievement.trophy}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-text-primary text-lg">
                            {achievement.title[lang]}
                          </h4>
                          <span className="px-3 py-1 bg-accent text-text-primary rounded-full text-sm font-semibold">
                            {achievement.year}
                          </span>
                        </div>
                        <p className="text-text-secondary">
                          {achievement.description[lang]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Training Schedule */}
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-primary" />
                {t("sportsTeams.detail.trainingSchedule")}
              </h3>
              <p className="text-text-secondary">
                {team.trainingSchedule[lang]}
              </p>
            </div>

            {/* Facilities */}
            {team.facilities && (
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  {t("sportsTeams.detail.facilities")}
                </h3>
                <ul className="space-y-2">
                  {team.facilities[lang].map((facility, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-text-secondary"
                    >
                      <Star className="w-4 h-4 mr-2 text-accent" />
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">
                {t("sportsTeams.detail.joinTeam")}
              </h3>
              <p className="mb-4 text-white/90 text-sm">
                {t("sportsTeams.detail.joinTeamDescription")}
              </p>
              <button className="w-full bg-white text-primary py-3 rounded-xl font-semibold hover:bg-accent hover:text-text-primary transition-all duration-300">
                {t("Contact Us")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsTeamDetail;
