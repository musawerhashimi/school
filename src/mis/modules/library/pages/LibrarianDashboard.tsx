/**
 * LibrarianDashboard Page
 * Modern, beautiful dashboard for library management
 */

import { Link } from 'react-router-dom';
import {
  Book,
  BookOpen,
  Users,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowRight,
  Plus,
  RotateCcw,
  Loader2,
  Calendar,
  Sparkles,
  Library,
  BookMarked,
  ArrowUpRight,
  Timer,
} from 'lucide-react';
import Button from '@mis-components/ui/Button';
import { Card, CardContent } from '@mis-components/ui/Card';
import Badge from '@mis-components/ui/Badge';
import {
  useDashboardStats,
  usePopularBooks,
  useOverdueBorrows,
} from '../hooks/useLibrary';

export function LibrarianDashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: popularBooks = [], isLoading: popularLoading } = usePopularBooks(5);
  const { data: overdueRecords = [], isLoading: overdueLoading } = useOverdueBorrows();

  const currentDate = new Date();
  const greeting = getGreeting();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-[#1e1b4b] p-8 mb-8">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />

        {/* Floating Book Icons */}
        <div className="absolute top-6 right-12 opacity-10">
          <Book className="w-24 h-24 text-white" />
        </div>
        <div className="absolute bottom-8 right-1/4 opacity-10">
          <BookOpen className="w-16 h-16 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-white/70">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {currentDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white">
                {greeting}, Librarian!
              </h1>
              <p className="text-lg text-white/80 max-w-xl">
                Manage your library efficiently. Track books, monitor borrows, and keep everything organized.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/mis/library/issue">
                <Button
                  size="lg"
                  className="bg-primary text-text-primary hover:bg-primary/40 shadow-xl shadow-black/20 font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Issue Book
                </Button>
              </Link>
              <Link to="/mis/library/return">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Return Book
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Library Overview</h2>
        </div>

        {statsLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-surface animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Books"
              value={stats?.total_books || 0}
              subtitle={`${stats?.digital_books || 0} digital books`}
              icon={<Library className="w-6 h-6" />}
              color="violet"
            />
            <StatCard
              title="Available Copies"
              value={stats?.available_copies || 0}
              subtitle={`of ${stats?.total_copies || 0} total copies`}
              icon={<BookOpen className="w-6 h-6" />}
              color="emerald"
              progress={stats?.total_copies ? Math.round((stats.available_copies || 0) / stats.total_copies * 100) : 0}
            />
            <StatCard
              title="Active Borrows"
              value={stats?.active_borrows || 0}
              subtitle="Currently issued"
              icon={<Users className="w-6 h-6" />}
              color="cyan"
            />
            <StatCard
              title="Overdue Books"
              value={stats?.overdue_count || 0}
              subtitle="Needs attention"
              icon={<AlertTriangle className="w-6 h-6" />}
              color="rose"
              alert={stats?.overdue_count ? stats.overdue_count > 0 : false}
            />
            <StatCard
              title="Pending Fines"
              value={`$${(stats?.pending_fines || 0).toFixed(2)}`}
              subtitle="Uncollected amount"
              icon={<DollarSign className="w-6 h-6" />}
              color="amber"
            />
            <StatCard
              title="Collected This Month"
              value={`$${(stats?.total_fines_collected || 0).toFixed(2)}`}
              subtitle="Fines collected"
              icon={<TrendingUp className="w-6 h-6" />}
              color="emerald"
            />
            <StatCard
              title="New Arrivals"
              value={stats?.new_books_this_month || 0}
              subtitle="Added this month"
              icon={<Sparkles className="w-6 h-6" />}
              color="violet"
            />
            <StatCard
              title="Monthly Activity"
              value={stats?.borrows_this_month || 0}
              subtitle={`${stats?.returns_this_month || 0} books returned`}
              icon={<Calendar className="w-6 h-6" />}
              color="cyan"
            />
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-5 mb-8">
        {/* Overdue Books - Takes 3 columns */}
        <div className="lg:col-span-3">
          <Card variant="elevated" className="border-0 overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-library-rose-soft">
                    <AlertTriangle className="w-6 h-6 text-library-rose" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Overdue Books</h3>
                    <p className="text-sm text-text-secondary">Requires immediate attention</p>
                  </div>
                </div>
                <Link to="/mis/library/borrows?status=overdue">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-dark">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            <CardContent className="p-0 mt-0">
              {overdueLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : overdueRecords.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success-soft flex items-center justify-center">
                    <BookMarked className="w-10 h-10 text-success" />
                  </div>
                  <p className="text-lg font-semibold text-text-primary">All Clear!</p>
                  <p className="text-sm text-text-secondary mt-1">No overdue books at the moment</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {overdueRecords.slice(0, 5).map((record, index) => (
                    <div
                      key={record.id}
                      className="flex items-center gap-4 p-4 hover:bg-surface-hover transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-library-rose-soft flex items-center justify-center">
                        <Timer className="w-6 h-6 text-library-rose" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary truncate">{record.book_title}</p>
                        <p className="text-sm text-text-secondary">
                          {record.student_name} • {record.student_class}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <Badge variant="error" className="mb-1">
                          {record.days_overdue} days late
                        </Badge>
                        <p className="text-sm font-bold text-library-rose">${record.fine_amount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Popular Books - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card variant="elevated" className="border-0 h-full">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-library-amber-soft">
                    <TrendingUp className="w-6 h-6 text-library-amber" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-primary">Trending Books</h3>
                    <p className="text-sm text-text-secondary">Most borrowed</p>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-4 mt-0">
              {popularLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : popularBooks.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-surface flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-muted" />
                  </div>
                  <p className="text-text-secondary">No data yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {popularBooks.map((book, index) => (
                    <Link
                      key={book.id}
                      to={`/mis/library/catalog/${book.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-hover transition-all group"
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                        index === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                        index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        'bg-surface text-text-primary'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                          {book.title}
                        </p>
                        <p className="text-xs text-text-secondary truncate">{book.author}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary">{book.times_borrowed}</span>
                        <ArrowUpRight className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-secondary/10">
            <Sparkles className="w-5 h-5 text-secondary" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Quick Actions</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard
            title="Book Catalog"
            description="Browse all books"
            icon={<Book className="w-7 h-7" />}
            href="/mis/library/catalog"
            gradient="from-violet-500 to-purple-600"
          />
          <QuickActionCard
            title="Add New Book"
            description="Expand collection"
            icon={<Plus className="w-7 h-7" />}
            href="/mis/library/catalog/new"
            gradient="from-emerald-500 to-teal-600"
          />
          <QuickActionCard
            title="Borrow History"
            description="View all records"
            icon={<Clock className="w-7 h-7" />}
            href="/mis/library/borrows"
            gradient="from-cyan-500 to-blue-600"
          />
          <QuickActionCard
            title="Active Borrows"
            description="Currently issued"
            icon={<Users className="w-7 h-7" />}
            href="/mis/library/borrows?status=active"
            gradient="from-orange-500 to-red-500"
          />
        </div>
      </div>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: 'violet' | 'emerald' | 'cyan' | 'rose' | 'amber' | 'orange';
  progress?: number;
  alert?: boolean;
}

function StatCard({ title, value, subtitle, icon, color, progress, alert }: StatCardProps) {
  const colorStyles = {
    violet: {
      bg: 'bg-library-violet-soft',
      text: 'text-library-violet',
      gradient: 'from-library-violet/20 to-transparent',
    },
    emerald: {
      bg: 'bg-library-emerald-soft',
      text: 'text-library-emerald',
      gradient: 'from-library-emerald/20 to-transparent',
    },
    cyan: {
      bg: 'bg-library-cyan-soft',
      text: 'text-library-cyan',
      gradient: 'from-library-cyan/20 to-transparent',
    },
    rose: {
      bg: 'bg-library-rose-soft',
      text: 'text-library-rose',
      gradient: 'from-library-rose/20 to-transparent',
    },
    amber: {
      bg: 'bg-library-amber-soft',
      text: 'text-library-amber',
      gradient: 'from-library-amber/20 to-transparent',
    },
    orange: {
      bg: 'bg-library-orange-soft',
      text: 'text-library-orange',
      gradient: 'from-library-orange/20 to-transparent',
    },
  };

  const styles = colorStyles[color];

  return (
    <Card
      variant="elevated"
      padding="none"
      className={`relative overflow-hidden border-0 group hover:shadow-xl transition-all duration-300 ${alert ? 'ring-2 ring-library-rose/50' : ''}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${styles.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-2xl ${styles.bg}`}>
            <span className={styles.text}>{icon}</span>
          </div>
          {alert && (
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-library-rose opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-library-rose" />
            </span>
          )}
        </div>
        <div>
          <p className="text-3xl font-bold text-text-primary mb-1">{value}</p>
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-xs text-muted mt-1">{subtitle}</p>
        </div>
        {progress !== undefined && (
          <div className="mt-4">
            <div className="h-1.5 bg-surface rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${styles.bg} transition-all duration-500`}
                style={{ width: `${progress}%`, backgroundColor: `var(--color-library-${color})` }}
              />
            </div>
            <p className="text-xs text-muted mt-1">{progress}% available</p>
          </div>
        )}
      </div>
    </Card>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
}

function QuickActionCard({ title, description, icon, href, gradient }: QuickActionCardProps) {
  return (
    <Link to={href} className="group">
      <Card
        variant="elevated"
        padding="none"
        className="border-0 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      >
        <div className="p-6">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          <h3 className="text-lg font-bold text-text-primary mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <div className={`h-1 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
      </Card>
    </Link>
  );
}

export default LibrarianDashboard;
