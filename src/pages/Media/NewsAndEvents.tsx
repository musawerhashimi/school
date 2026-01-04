import {
  ArrowRight,
  Bell,
  Calendar,
  CalendarDays,
  Clock,
  Facebook,
  Filter,
  Heart,
  Link2,
  Mail,
  MapPin,
  MessageCircle,
  Newspaper,
  Search,
  Share2,
  Trophy,
  Twitter,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import PageHeader from "../../components/layout/PageHeader";
// Mock Data
type Category =
  | "Achievement"
  | "Announcement"
  | "Activities"
  | "Academic"
  | "Competition"
  | "Cultural"
  | "Workshop"
  | "Networking";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  author: string;
  authorRole: string;
  date: string;
  image: string;
  featured: boolean;
  tags: string[];
  likes: number;
  comments: number;
}

interface Event {
  id: number;
  title: string;
  image: string;
  date: string;
  time: string;
  category: Category;
  rsvpRequired: boolean;
  location: string;
  organizer: string;
  attendees: number;
  featured: boolean;
  maxAttendees: number;
  description: string;
}

const newsArticles: Article[] = [
  {
    id: 1,
    title: "Sultan Zoy Students Win National Science Olympiad",
    excerpt:
      "Our brilliant students brought home gold medals from the National Science Olympiad, competing against 150 schools nationwide.",
    content:
      "In an outstanding display of scientific excellence, three students from Sultan Zoy High School secured top positions at the National Science Olympiad...",
    category: "Achievement",
    author: "Dr. Ahmad Khalil",
    authorRole: "Principal",
    date: "2024-12-10",
    image: "images/bg-3.jpg",
    featured: true,
    tags: ["Science", "Competition", "Achievement"],
    likes: 234,
    comments: 45,
  },
  {
    id: 2,
    title: "New State-of-the-Art Computer Lab Inaugurated",
    excerpt:
      "Sultan Zoy High School opens cutting-edge computer laboratory with 50 workstations and latest technology.",
    content:
      "We are proud to announce the opening of our new computer laboratory...",
    category: "Announcement",
    author: "Sarah Ahmed",
    authorRole: "IT Coordinator",
    date: "2024-12-08",
    image: "images/bg-3.jpg",
    featured: false,
    tags: ["Technology", "Infrastructure", "STEM"],
    likes: 189,
    comments: 32,
  },
  {
    id: 3,
    title: "Annual Sports Day Celebration 2024",
    excerpt:
      "Students showcase athletic excellence in various sports competitions during the annual sports day event.",
    content:
      "The annual sports day was a magnificent celebration of athleticism and sportsmanship...",
    category: "Activities",
    author: "Coach Hassan",
    authorRole: "Sports Coordinator",
    date: "2024-12-05",
    image: "images/bg-3.jpg",
    featured: false,
    tags: ["Sports", "Events", "Students"],
    likes: 312,
    comments: 67,
  },
  {
    id: 4,
    title: "Partnership with International Educational Foundation",
    excerpt:
      "Sultan Zoy High School signs collaboration agreement with Global Education Alliance for student exchange programs.",
    content:
      "We are thrilled to announce our new partnership with the Global Education Alliance...",
    category: "Announcement",
    author: "Dr. Ahmad Khalil",
    authorRole: "Principal",
    date: "2024-12-03",
    image: "images/bg-3.jpg",
    featured: false,
    tags: ["Partnership", "International", "Education"],
    likes: 156,
    comments: 28,
  },
  {
    id: 5,
    title: "Art Exhibition Showcases Student Creativity",
    excerpt:
      "Annual art exhibition features stunning works from talented students across all grade levels.",
    content:
      "Our students' artistic talents were on full display at the annual art exhibition...",
    category: "Activities",
    author: "Ms. Fatima",
    authorRole: "Art Teacher",
    date: "2024-11-28",
    image: "images/bg-3.jpg",
    featured: false,
    tags: ["Arts", "Exhibition", "Creativity"],
    likes: 203,
    comments: 41,
  },
  {
    id: 6,
    title: "Environmental Club Plants 500 Trees",
    excerpt:
      "Student-led environmental initiative contributes to community greening project with massive tree plantation drive.",
    content:
      "The Environmental Club organized a successful tree plantation campaign...",
    category: "Achievement",
    author: "Green Team",
    authorRole: "Environmental Club",
    date: "2024-11-25",
    image: "images/bg-3.jpg",
    featured: false,
    tags: ["Environment", "Community", "Students"],
    likes: 278,
    comments: 52,
  },
];

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Winter Parent-Teacher Conference",
    description:
      "Meet with teachers to discuss student progress and academic performance for the first semester.",
    date: "2024-12-20",
    time: "09:00 AM - 04:00 PM",
    location: "Main Auditorium",
    category: "Academic",
    attendees: 450,
    maxAttendees: 500,
    image: "images/bg-3.jpg",
    featured: true,
    rsvpRequired: true,
    organizer: "Academic Office",
  },
  {
    id: 2,
    title: "Science Fair 2025",
    description:
      "Annual science fair showcasing innovative student projects in physics, chemistry, biology, and technology.",
    date: "2025-01-15",
    time: "10:00 AM - 03:00 PM",
    location: "Science Building",
    category: "Competition",
    attendees: 320,
    maxAttendees: 400,
    image: "images/bg-3.jpg",
    featured: false,
    rsvpRequired: true,
    organizer: "Science Department",
  },
  {
    id: 3,
    title: "Cultural Festival 2025",
    description:
      "Celebrate diversity with traditional music, dance, food, and cultural performances from various communities.",
    date: "2025-01-25",
    time: "06:00 PM - 09:00 PM",
    location: "School Grounds",
    category: "Cultural",
    attendees: 580,
    maxAttendees: 800,
    image: "images/bg-3.jpg",
    featured: true,
    rsvpRequired: false,
    organizer: "Cultural Committee",
  },
  {
    id: 4,
    title: "Mathematics Olympiad Preparation Workshop",
    description:
      "Intensive workshop for students preparing for national and international mathematics competitions.",
    date: "2025-01-10",
    time: "02:00 PM - 05:00 PM",
    location: "Room 301",
    category: "Workshop",
    attendees: 45,
    maxAttendees: 50,
    image: "images/bg-3.jpg",
    featured: false,
    rsvpRequired: true,
    organizer: "Math Department",
  },
  {
    id: 5,
    title: "Career Guidance Seminar",
    description:
      "Professional counselors and industry experts guide students on career choices and higher education pathways.",
    date: "2025-02-05",
    time: "01:00 PM - 04:00 PM",
    location: "Main Hall",
    category: "Academic",
    attendees: 230,
    maxAttendees: 300,
    image: "images/bg-3.jpg",
    featured: false,
    rsvpRequired: true,
    organizer: "Counseling Department",
  },
  {
    id: 6,
    title: "Alumni Networking Event",
    description:
      "Connect with successful alumni, share experiences, and build professional networks for future opportunities.",
    date: "2025-02-15",
    time: "05:00 PM - 08:00 PM",
    location: "Conference Center",
    category: "Networking",
    attendees: 150,
    maxAttendees: 200,
    image: "images/bg-3.jpg",
    featured: false,
    rsvpRequired: true,
    organizer: "Alumni Association",
  },
];

// Reusable Components
// function PageHeader({ title, subtitle, breadcrumb }: { title: , subtitle, breadcrumb }) {
//   return (
//     <div className="bg-gradient-to-br from-primary via-primary-dark to-secondary text-white py-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center gap-2 text-sm mb-4 opacity-90">
//           {breadcrumb.map((item, index) => (
//             <React.Fragment key={index}>
//               <span
//                 className={index === breadcrumb.length - 1 ? "font-semibold" : ""}
//               >
//                 {item}
//               </span>
//               {index < breadcrumb.length - 1 && (
//                 <ChevronRight className="w-4 h-4" />
//               )}
//             </React.Fragment>
//           ))}
//         </div>
//         <h1 className="text-5xl font-bold mb-4">{title}</h1>
//         <p className="text-xl opacity-90 max-w-3xl">{subtitle}</p>
//       </div>
//     </div>
//   );
// }

function CategoryBadge({ category }: { category: Category }) {
  const colors = {
    Achievement:
      "bg-secondary bg-opacity-20 text-text-secondary border-secondary",
    Announcement: "bg-primary bg-opacity-20 text-text-primary border-primary",
    Activities: "bg-accent bg-opacity-20 text-text-accent border-accent",
    Academic: "bg-primary bg-opacity-20 text-text-primary border-primary",
    Competition:
      "bg-secondary bg-opacity-20 text-text-secondary border-secondary",
    Cultural: "bg-accent bg-opacity-20 text-text-accent border-accent",
    Workshop: "bg-primary bg-opacity-20 text-text-primary border-primary",
    Networking:
      "bg-secondary bg-opacity-20 text-text-secondary border-secondary",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        colors[category] || "bg-surface text-text-secondary border-border"
      }`}
    >
      {category}
    </span>
  );
}

function NewsCard({
  news,
  onClick,
  featured = false,
}: {
  news: Article;
  onClick: () => void;
  featured: boolean;
}) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className={`bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group ${
        featured ? "md:col-span-2" : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`relative overflow-hidden ${featured ? "md:h-96" : "h-48"}`}
      >
        <img
          src={news.image}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <CategoryBadge category={news.category} />
        </div>
        {featured && (
          <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Featured
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {new Date(news.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span>•</span>
          <span>{news.authorRole}</span>
        </div>

        <h3
          className={`font-bold text-text-primary mb-3 group-hover:text-primary transition-colors ${
            featured ? "text-2xl" : "text-xl"
          }`}
        >
          {news.title}
        </h3>

        <p className="text-text-secondary mb-4 line-clamp-2">{news.excerpt}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {news.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-surface text-text-secondary text-xs rounded-md border border-border"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-4 text-text-secondary text-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              className={`flex items-center gap-1 hover:text-primary transition-colors ${
                isLiked ? "text-primary" : ""
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              {news.likes + (isLiked ? 1 : 0)}
            </button>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {news.comments}
            </span>
          </div>
          <button className="text-primary font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
            Read More
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EventCard({
  event,
  onClick,
  featured = false,
}: {
  event: Event;
  onClick: () => void;
  featured?: boolean;
}) {
  const daysUntil = Math.ceil(
    (new Date(event.date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const attendancePercent = (event.attendees / event.maxAttendees) * 100;

  return (
    <div
      className={`bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group ${
        featured ? "md:col-span-2" : ""
      }`}
      onClick={onClick}
    >
      <div
        className={`relative overflow-hidden ${featured ? "md:h-80" : "h-56"}`}
      >
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white text-primary px-4 py-3 rounded-lg shadow-lg text-center">
          <div className="text-3xl font-bold">
            {new Date(event.date).getDate()}
          </div>
          <div className="text-xs uppercase">
            {new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
            })}
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <CategoryBadge category={event.category} />
        </div>
        {daysUntil <= 7 && daysUntil > 0 && (
          <div className="absolute bottom-4 right-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
            In {daysUntil} days!
          </div>
        )}
      </div>

      <div className="p-6">
        <h3
          className={`font-bold text-text-primary mb-3 group-hover:text-primary transition-colors ${
            featured ? "text-2xl" : "text-xl"
          }`}
        >
          {event.title}
        </h3>

        <p className="text-text-secondary mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Clock className="w-4 h-4 text-primary" />
            {event.time}
          </div>
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <MapPin className="w-4 h-4 text-secondary" />
            {event.location}
          </div>
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <Users className="w-4 h-4 text-accent" />
            {event.attendees} / {event.maxAttendees} attendees
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs text-text-secondary mb-1">
            <span>Attendance</span>
            <span>{attendancePercent.toFixed(0)}% Full</span>
          </div>
          <div className="w-full bg-surface rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-secondary to-primary h-full transition-all duration-500"
              style={{ width: `${attendancePercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex gap-3">
          {event.rsvpRequired && (
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="flex-1 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              RSVP Now
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex-1 bg-surface text-text-primary border border-border py-2 rounded-lg font-semibold hover:bg-card transition-colors flex items-center justify-center gap-2"
          >
            <CalendarDays className="w-4 h-4" />
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  );
}

const NewsDetailModal = ({
  news,
  onClose,
}: {
  news: Article;
  onClose: () => void;
}) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  if (!news) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-96 overflow-hidden">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-error bg-opacity-20 backdrop-blur-sm text-white hover:bg-opacity-30 rounded-lg p-2 transition-colors"
          >
            ✕
          </button>
          <div className="absolute bottom-6 left-6">
            <CategoryBadge category={news.category} />
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(news.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span>By {news.author}</span>
            <span>•</span>
            <span>{news.authorRole}</span>
          </div>

          <h1 className="text-4xl font-bold text-text-primary mb-6">
            {news.title}
          </h1>

          <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-6 text-text-secondary">
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <Heart className="w-5 h-5" />
                <span>{news.likes} Likes</span>
              </button>
              <button className="flex items-center gap-2 hover:text-primary transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>{news.comments} Comments</span>
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>

              {showShareMenu && (
                <div className="absolute right-0 mt-2 bg-card border border-border rounded-lg shadow-xl p-2 min-w-[200px]">
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface rounded-lg transition-colors text-text-primary">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    Facebook
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface rounded-lg transition-colors text-text-primary">
                    <Twitter className="w-4 h-4 text-sky-500" />
                    Twitter
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface rounded-lg transition-colors text-text-primary">
                    <Mail className="w-4 h-4 text-red-500" />
                    Email
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-surface rounded-lg transition-colors text-text-primary">
                    <Link2 className="w-4 h-4 text-text-secondary" />
                    Copy Link
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="prose max-w-none">
            <p className="text-lg text-text-primary leading-relaxed mb-6">
              {news.excerpt}
            </p>
            <p className="text-text-primary leading-relaxed mb-6">
              {news.content}
            </p>
            <p className="text-text-primary leading-relaxed mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-text-primary leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="font-semibold text-text-primary mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {news.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary bg-opacity-10 text-white/90 rounded-lg border border-primary border-opacity-20"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventDetailModal = ({
  event,
  onClose,
}: {
  event: Event;
  onClose: () => void;
}) => {
  if (!event) return null;
  const daysUntil = Math.ceil(
    (new Date(event.date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-96 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-error/90 backdrop-blur-sm text-white hover:bg-error/100 rounded-lg p-2 transition-colors"
          >
            ✕
          </button>
          <div className="absolute top-4 left-4 bg-white text-primary px-6 py-4 rounded-lg shadow-lg text-center">
            <div className="text-4xl font-bold">
              {new Date(event.date).getDate()}
            </div>
            <div className="text-sm uppercase font-semibold">
              {new Date(event.date).toLocaleDateString("en-US", {
                month: "short",
              })}
            </div>
          </div>
          {daysUntil > 0 && (
            <div className="absolute bottom-6 right-6 bg-accent text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg">
              {daysUntil} Days to Go!
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <CategoryBadge category={event.category} />
            {event.rsvpRequired && (
              <span className="px-3 py-1 bg-secondary bg-opacity-20 text-text-secondary rounded-full text-xs font-semibold border border-secondary">
                RSVP Required
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold text-text-primary mb-6">
            {event.title}
          </h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-surface p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Event Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Date:</span>
                  <span className="font-semibold text-text-primary">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Time:</span>
                  <span className="font-semibold text-text-primary">
                    {event.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Location:</span>
                  <span className="font-semibold text-text-primary">
                    {event.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Organizer:</span>
                  <span className="font-semibold text-text-primary">
                    {event.organizer}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-xl border border-border">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-secondary" />
                Attendance
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">Registered</span>
                    <span className="font-semibold text-text-primary">
                      {event.attendees} / {event.maxAttendees}
                    </span>
                  </div>
                  <div className="w-full bg-card rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-secondary to-primary h-full transition-all duration-500"
                      style={{
                        width: `${
                          (event.attendees / event.maxAttendees) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">Spots Available</span>
                    <span className="text-2xl font-bold text-secondary">
                      {event.maxAttendees - event.attendees}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold text-text-primary mb-4">
              About This Event
            </h3>
            <p className="text-text-primary leading-relaxed mb-4">
              {event.description}
            </p>
            <p className="text-text-primary leading-relaxed">
              Join us for this exciting event where students, parents, and
              faculty come together. This is a wonderful opportunity to engage
              with our community and participate in meaningful activities that
              enrich our school culture.
            </p>
          </div>

          <div className="flex gap-4">
            {event.rsvpRequired && (
              <button className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                <Bell className="w-5 h-5" />
                Register for Event
              </button>
            )}
            <button className="flex-1 bg-surface text-text-primary border border-border py-3 rounded-lg font-semibold hover:bg-card transition-colors flex items-center justify-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Add to Calendar
            </button>
            <button className="bg-surface text-text-primary border border-border px-6 py-3 rounded-lg font-semibold hover:bg-card transition-colors flex items-center gap-2">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const NewsAndEvents = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedNews, setSelectedNews] = useState<Article | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "all",
    "Achievement",
    "Announcement",
    "Activities",
    "Academic",
    "Competition",
    "Cultural",
    "Workshop",
    "Networking",
  ];

  const filteredNews = useMemo(() => {
    return newsArticles.filter((news) => {
      const matchesSearch =
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "all" || news.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredNews = filteredNews.find((news) => news.featured);
  const regularNews = filteredNews.filter((news) => !news.featured);
  const featuredEvent = filteredEvents.find((event) => event.featured);
  const regularEvents = filteredEvents.filter((event) => !event.featured);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="News & Events"
        subtitle="Stay updated with the latest happenings, achievements, and upcoming events at Sultan Zoy High School"
        image="images/bg-5.jpg"
        breadcrumb={["Home", "News & Events"]}
      />

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder="Search news, events, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-surface border border-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto bg-surface border border-border px-6 py-4 rounded-xl text-text-primary font-semibold hover:bg-card transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-surface border border-border rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-text-primary mb-4">
                Filter by Category
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedCategory === category
                        ? "bg-primary text-white"
                        : "bg-card text-text-secondary border border-border hover:bg-surface"
                    }`}
                  >
                    {category === "all" ? "All Categories" : category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-12 border-b border-border">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === "all"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              All Updates
            </div>
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === "news"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-2">
              <Newspaper className="w-5 h-5" />
              News
            </div>
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-6 py-3 font-semibold transition-all relative ${
              activeTab === "events"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Events
            </div>
          </button>
        </div>

        {/* Content Display */}
        {(activeTab === "all" || activeTab === "news") && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-text-primary">
                Latest News
              </h2>
              <button className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                View All News
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredNews && (
                <NewsCard
                  news={featuredNews}
                  onClick={() => setSelectedNews(featuredNews)}
                  featured={true}
                />
              )}
              {regularNews
                .slice(0, activeTab === "news" ? 5 : 3)
                .map((news) => (
                  <NewsCard
                    featured={false}
                    key={news.id}
                    news={news}
                    onClick={() => setSelectedNews(news)}
                  />
                ))}
            </div>

            {filteredNews.length === 0 && (
              <div className="text-center py-16">
                <p className="text-text-secondary text-lg">
                  No news articles found matching your criteria.
                </p>
              </div>
            )}
          </div>
        )}

        {(activeTab === "all" || activeTab === "events") && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-text-primary">
                Upcoming Events
              </h2>
              <button className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                View Calendar
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredEvent && (
                <EventCard
                  event={featuredEvent}
                  onClick={() => setSelectedEvent(featuredEvent)}
                  featured={true}
                />
              )}
              {regularEvents
                .slice(0, activeTab === "events" ? 5 : 3)
                .map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-16">
                <p className="text-text-secondary text-lg">
                  No upcoming events found matching your criteria.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-br from-primary to-secondary rounded-2xl p-12 text-white text-center">
          <Bell className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-4">Never Miss an Update</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest news, events, and
            announcements delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-xl text-text-primary focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-colors whitespace-nowrap">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedNews && (
        <NewsDetailModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default NewsAndEvents;
