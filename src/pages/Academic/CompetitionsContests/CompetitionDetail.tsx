import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Mail,
  Trophy,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import CompetitionRegistrationModal from "./CompetitionRegistrationModal";
import { useNavigate, useParams } from "react-router-dom";
import {
  competitionCategories,
  competitions,
} from "../../../data/competitions";

export default function CompetitionDetail() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const competition = useMemo(
    () => competitions.find((c) => String(c.id) === id),
    [id],
  );

  if (!competition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium text-text-secondary">
          {t("competitions.detail.notFound")}
        </p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isRegistrationOpen =
    competition.status !== "completed" &&
    new Date(competition.registrationDeadline) > new Date();

  // Get category name by ID
  const getCategoryName = () => {
    const category = competitionCategories.find(
      (cat) => cat.id === competition.category_id,
    );
    return category ? category.name : "Unknown";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-info text-white";
      case "ongoing":
        return "bg-success text-white";
      case "completed":
        return "bg-muted text-text-primary";
      default:
        return "bg-muted text-text-primary";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Header Image */}
        <div className="relative h-80 overflow-hidden">
          <img
            src={competition.image}
            alt={competition.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          {/* Professional Back Button */}
          <button
            onClick={() => navigate("/competitions-contests")}
            className="absolute top-20 left-8 group flex items-center gap-2 bg-white/10 backdrop-blur-md px-2 py-2 rounded-xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300">
              <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform duration-300" />
            </div>
            <span className="text-white font-medium text-sm tracking-wide">
              {t("competitions.detail.backToList")}
            </span>
          </button>

          {/* Title and Badges */}
          <div className="absolute md:bottom-8 bottom-4 left-8 right-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {competition.title}
            </h1>

            <div className="flex flex-wrap gap-3 md:mt-4 mb-3">
              <span className={`badge bg-accent text-primary px-4 py-2`}>
                {getCategoryName()}
              </span>
              <span
                className={`badge ${getStatusColor(competition.status)} px-4 py-2`}
              >
                {t(`competitions.status.${competition.status}`)}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">
                  {t("competitions.detail.overview")}
                </h2>
                <p className="text-text-secondary">{competition.description}</p>
              </section>

              {/* Eligibility */}
              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">
                  {t("competitions.detail.eligibility")}
                </h2>
                <ul className="space-y-3">
                  {competition.eligibility.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Rules */}
              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-4">
                  {t("competitions.detail.rules")}
                </h2>
                <ul className="space-y-3">
                  {competition.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                      <span className="text-text-secondary">{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Prizes */}
              <section className="bg-card border border-border rounded-xl p-8">
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  {t("competitions.detail.prizes")}
                </h2>
                <div className="space-y-4">
                  {competition.prizes.map((prize, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-surface rounded-lg hover:bg-surface-hover transition-colors"
                    >
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <Trophy className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-text-primary mb-1">
                          {prize.position}
                        </h3>
                        <p className="text-text-secondary text-sm">
                          {prize.award}
                        </p>
                        {prize.description && (
                          <p className="text-text-secondary text-xs mt-1">
                            {prize.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Winners (if completed) */}
              {competition.status === "completed" && competition.winners && (
                <section className="bg-card border border-border rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-text-primary mb-6">
                    {t("competitions.detail.winners")}
                  </h2>
                  <div className="space-y-3">
                    {competition.winners.map((winner) => (
                      <div
                        key={winner.id}
                        className="flex items-center justify-between p-4 bg-surface rounded-lg"
                      >
                        <div>
                          <h3 className="font-semibold text-text-primary">
                            {winner.studentName}
                          </h3>
                          <p className="text-text-secondary text-sm">
                            {t("competitions.detail.grade")}: {winner.grade}
                          </p>
                        </div>
                        <span className="badge badge-accent">
                          {winner.position}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-card border border-border rounded-xl p-6 space-y-4 sticky top-8">
                <h3 className="text-xl font-bold text-text-primary mb-4">
                  {t("competitions.detail.details.category")}
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-text-secondary">
                        {t("competitions.detail.details.startDate")}
                      </p>
                      <p className="text-sm font-medium text-text-primary">
                        {formatDate(competition.startDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-text-secondary">
                        {t("competitions.detail.details.endDate")}
                      </p>
                      <p className="text-sm font-medium text-text-primary">
                        {formatDate(competition.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    <div>
                      <p className="text-xs text-text-secondary">
                        {t("competitions.detail.details.registrationDeadline")}
                      </p>
                      <p className="text-sm font-medium text-text-primary">
                        {formatDate(competition.registrationDeadline)}
                      </p>
                    </div>
                  </div>

                  {competition.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-text-secondary">
                          {t("competitions.detail.details.location")}
                        </p>
                        <p className="text-sm font-medium text-text-primary">
                          {competition.location}
                        </p>
                      </div>
                    </div>
                  )}

                  {competition.maxParticipants && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-text-secondary">
                          {t("competitions.detail.details.participants")}
                        </p>
                        <p className="text-sm font-medium text-text-primary">
                          {competition.currentParticipants} /{" "}
                          {competition.maxParticipants}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-text-secondary">
                        {t("competitions.detail.details.contact")}
                      </p>
                      <p className="text-sm font-medium text-text-primary">
                       info@sultanzoi-phs.com
                      </p>
                    </div>
                  </div>

                  {competition.isTeamEvent && competition.teamSize && (
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-text-secondary">
                          {t("competitions.detail.details.teamSize")}
                        </p>
                        <p className="text-sm font-medium text-text-primary">
                          {competition.teamSize.min} -{" "}
                          {competition.teamSize.max}{" "}
                          {t("competitions.detail.details.members")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Registration Button */}
                <div className="pt-4 border-t border-border">
                  {competition.status === "completed" ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 bg-muted text-text-secondary rounded-xl font-medium cursor-not-allowed"
                    >
                      {t("competitions.detail.eventCompleted")}
                    </button>
                  ) : isRegistrationOpen ? (
                    <button
                      onClick={() => setShowRegistrationModal(true)}
                      className="w-full btn-primary"
                    >
                      {t("competitions.detail.registerNow")}
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 px-4 bg-muted text-text-secondary rounded-xl font-medium cursor-not-allowed"
                    >
                      {t("competitions.detail.registrationClosed")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <CompetitionRegistrationModal
        competition={competition}
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />
    </>
  );
}
