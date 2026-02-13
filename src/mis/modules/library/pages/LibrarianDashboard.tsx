/**
 * LibrarianDashboard Page
 * Main dashboard for library management
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
} from 'lucide-react';
import Button from '@mis-components/ui/Button';
import { Card, CardContent, CardHeader } from '@mis-components/ui/Card';
import Badge from '@mis-components/ui/Badge';
import {
  useDashboardStats,
  usePopularBooks,
  useOverdueBorrows,
} from '../hooks/useLibrary';

export function LibrarianDashboard() {
  // Queries
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: popularBooks = [], isLoading: popularLoading } = usePopularBooks(5);
  const { data: overdueRecords = [], isLoading: overdueLoading } = useOverdueBorrows();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Library Dashboard</h1>
          <p className="text-text-secondary">
            Manage books, borrows, and library operations
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/mis/library/issue">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Issue Book
            </Button>
          </Link>
          <Link to="/mis/library/return">
            <Button variant="outline" leftIcon={<RotateCcw className="h-4 w-4" />}>
              Return Book
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {statsLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-1/2 rounded bg-surface" />
                  <div className="h-8 w-1/3 rounded bg-surface" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Books"
            value={stats?.total_books || 0}
            icon={<Book className="h-5 w-5" />}
            description={`${stats?.digital_books || 0} digital`}
          />
          <StatCard
            title="Total Copies"
            value={stats?.total_copies || 0}
            icon={<BookOpen className="h-5 w-5" />}
            description={`${stats?.available_copies || 0} available`}
            trend={
              stats?.total_copies
                ? Math.round(
                    ((stats.available_copies || 0) / stats.total_copies) * 100
                  )
                : 0
            }
          />
          <StatCard
            title="Active Borrows"
            value={stats?.active_borrows || 0}
            icon={<Users className="h-5 w-5" />}
            description="Currently issued"
          />
          <StatCard
            title="Overdue"
            value={stats?.overdue_count || 0}
            icon={<AlertTriangle className="h-5 w-5" />}
            description="Books overdue"
            variant={stats?.overdue_count ? 'destructive' : 'default'}
          />
          <StatCard
            title="Pending Fines"
            value={`$${(stats?.pending_fines || 0).toFixed(2)}`}
            icon={<DollarSign className="h-5 w-5" />}
            description="Uncollected"
          />
          <StatCard
            title="Collected This Month"
            value={`$${(stats?.total_fines_collected || 0).toFixed(2)}`}
            icon={<TrendingUp className="h-5 w-5" />}
            description="Fines collected"
          />
          <StatCard
            title="New Books"
            value={stats?.new_books_this_month || 0}
            icon={<Plus className="h-5 w-5" />}
            description="Added this month"
          />
          <StatCard
            title="Borrows This Month"
            value={stats?.borrows_this_month || 0}
            icon={<Clock className="h-5 w-5" />}
            description={`${stats?.returns_this_month || 0} returns`}
          />
        </div>
      )}

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Overdue Books */}
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Overdue Books
              </span>
            }
            subtitle="Books that need to be returned"
            action={
              <Link to="/mis/library/borrows?status=overdue">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            }
          />
          <CardContent>
            {overdueLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : overdueRecords.length === 0 ? (
              <p className="py-8 text-center text-text-secondary">
                No overdue books
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-medium">Book</th>
                      <th className="px-4 py-3 text-left font-medium">Student</th>
                      <th className="px-4 py-3 text-left font-medium">Days Overdue</th>
                      <th className="px-4 py-3 text-left font-medium">Fine</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overdueRecords.slice(0, 5).map((record) => (
                      <tr key={record.id} className="border-b border-border">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium line-clamp-1">
                              {record.book_title}
                            </p>
                            <p className="text-xs text-text-secondary font-mono">
                              {record.barcode}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p>{record.student_name}</p>
                            <p className="text-xs text-text-secondary">
                              {record.student_class}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="error">
                            {record.days_overdue} days
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-medium">
                          ${record.fine_amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Popular Books */}
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Books
              </span>
            }
            subtitle="Most borrowed books"
            action={
              <Link to="/mis/library/catalog?ordering=-times_borrowed">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            }
          />
          <CardContent>
            {popularLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : popularBooks.length === 0 ? (
              <p className="py-8 text-center text-text-secondary">
                No borrow data yet
              </p>
            ) : (
              <div className="space-y-4">
                {popularBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="flex items-center gap-4"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface font-medium">
                      {index + 1}
                    </span>
                    <div className="h-12 w-8 overflow-hidden rounded bg-gray-100">
                      {book.cover_image ? (
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Book className="h-full w-full p-1 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/mis/library/catalog/${book.id}`}
                        className="font-medium hover:text-primary line-clamp-1"
                      >
                        {book.title}
                      </Link>
                      <p className="text-sm text-text-secondary line-clamp-1">
                        {book.author}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{book.times_borrowed}</p>
                      <p className="text-xs text-text-secondary">borrows</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLinkCard
          title="Book Catalog"
          description="Browse and manage books"
          icon={<Book className="h-6 w-6" />}
          href="/mis/library/catalog"
        />
        <QuickLinkCard
          title="Add New Book"
          description="Add a book to the catalog"
          icon={<Plus className="h-6 w-6" />}
          href="/mis/library/catalog/new"
        />
        <QuickLinkCard
          title="Borrow Records"
          description="View all borrow history"
          icon={<Clock className="h-6 w-6" />}
          href="/mis/library/borrows"
        />
        <QuickLinkCard
          title="Active Borrows"
          description="View currently issued books"
          icon={<Users className="h-6 w-6" />}
          href="/mis/library/borrows?status=active"
        />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  variant = 'default',
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
  variant?: 'default' | 'destructive';
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div
            className={`rounded-lg p-2 ${
              variant === 'destructive'
                ? 'bg-red-100 text-red-600'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {icon}
          </div>
          {trend !== undefined && (
            <span className="text-xs text-text-secondary">
              {trend}% available
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-text-secondary">{title}</p>
          {description && (
            <p className="mt-1 text-xs text-text-secondary">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuickLinkCard({
  title,
  description,
  icon,
  href,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Link to={href}>
      <Card hover className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-4 pt-6">
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            {icon}
          </div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-text-secondary">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default LibrarianDashboard;
