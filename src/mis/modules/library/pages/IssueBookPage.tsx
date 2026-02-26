/**
 * IssueBookPage
 * Modern page to issue a book to a student with searchable selection
 */

import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, addDays } from "date-fns";
import {
  ArrowLeft,
  Search,
  User,
  Calendar,
  Book,
  CheckCircle2,
  Loader2,
  BookOpen,
  MapPin,
  Hash,
  GraduationCap,
  AlertTriangle,
  Sparkles,
  X,
  ChevronDown,
} from "lucide-react";
import Button from "@mis-components/ui/Button";
import Input from "@mis-components/ui/Input";
import { Card, CardContent } from "@mis-components/ui/Card";
import Badge from "@mis-components/ui/Badge";
import {
  useBookCopies,
  useIssueBook,
  useStudentLibrarySummary,
} from "../hooks/useLibrary";
import { useStudents } from "@/mis/modules/students/hooks/useStudents";
import {
  issueBookSchema,
  type IssueBookFormData,
} from "../schemas/librarySchemas";
import { LIBRARY_DEFAULTS, COPY_STATUS_CONFIG } from "../constants";
import type { BookCopyListResponse } from "../types";

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function IssueBookPage() {
  // Search states
  const [studentSearch, setStudentSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showBookDropdown, setShowBookDropdown] = useState(false);

  // Selected items
  const [selectedStudent, setSelectedStudent] = useState<{
    id: number;
    name: string;
    studentId: string;
    className?: string;
    photo?: string;
  } | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookCopyListResponse | null>(
    null
  );

  // Refs for click outside
  const studentDropdownRef = useRef<HTMLDivElement>(null);
  const bookDropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  const debouncedStudentSearch = useDebounce(studentSearch, 300);
  const debouncedBookSearch = useDebounce(bookSearch, 300);

  // Queries
  const { data: studentsData, isLoading: studentsLoading } = useStudents({
    search: debouncedStudentSearch,
    page_size: 10,
    status: "active",
  });

  const { data: copiesData, isLoading: copiesLoading } = useBookCopies({
    search: debouncedBookSearch,
    status: "available",
    page_size: 10,
  });

  const { data: studentSummary, isLoading: summaryLoading } =
    useStudentLibrarySummary(selectedStudent?.id || 0);

  // Issue mutation
  const issueMutation = useIssueBook();

  // Form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<IssueBookFormData>({
    resolver: zodResolver(issueBookSchema),
    defaultValues: {
      barcode: "",
      student_id: undefined as unknown as number,
      due_date: format(
        addDays(new Date(), LIBRARY_DEFAULTS.loanPeriodDays),
        "yyyy-MM-dd"
      ),
      notes: "",
    },
  });

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        studentDropdownRef.current &&
        !studentDropdownRef.current.contains(e.target as Node)
      ) {
        setShowStudentDropdown(false);
      }
      if (
        bookDropdownRef.current &&
        !bookDropdownRef.current.contains(e.target as Node)
      ) {
        setShowBookDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle student selection
  const handleSelectStudent = (student: {
    id: number;
    full_name: string;
    student_id: string;
    current_class_name?: string;
    photo?: string;
  }) => {
    setSelectedStudent({
      id: student.id,
      name: student.full_name,
      studentId: student.student_id,
      className: student.current_class_name,
      photo: student.photo,
    });
    setValue("student_id", student.id);
    setStudentSearch("");
    setShowStudentDropdown(false);
  };

  // Handle book selection
  const handleSelectBook = (copy: BookCopyListResponse) => {
    setSelectedBook(copy);
    setValue("barcode", copy.barcode);
    setBookSearch("");
    setShowBookDropdown(false);
  };

  // Clear selections
  const clearStudent = () => {
    setSelectedStudent(null);
    setValue("student_id", undefined as unknown as number);
  };

  const clearBook = () => {
    setSelectedBook(null);
    setValue("barcode", "");
  };

  // Submit handler
  const onSubmit = async (data: IssueBookFormData) => {
    try {
      await issueMutation.mutateAsync({
        barcode: data.barcode,
        student_id: data.student_id,
        due_date: data.due_date,
        notes: data.notes,
      });
      // Reset for next issue
      reset({
        barcode: "",
        student_id: undefined as unknown as number,
        due_date: format(
          addDays(new Date(), LIBRARY_DEFAULTS.loanPeriodDays),
          "yyyy-MM-dd"
        ),
        notes: "",
      });
      setSelectedStudent(null);
      setSelectedBook(null);
    } catch {
      // Error handled by mutation
    }
  };

  const canIssue =
    selectedBook?.is_available &&
    selectedStudent &&
    studentSummary?.can_borrow &&
    !studentSummary?.has_overdue;

  // Students list
  const students = useMemo(() => {
    if (!studentsData?.results) return [];
    return studentsData.results;
  }, [studentsData]);

  // Available copies
  const availableCopies = useMemo(() => {
    if (!copiesData?.results) return [];
    return copiesData.results.filter((c) => c.is_available);
  }, [copiesData]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <Link to="/mis/library">
            <Button variant="ghost" className="h-10 w-10 p-0 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary" />
              Issue Book
            </h1>
            <p className="text-text-secondary text-sm">
              Select a student and book to issue
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Selection */}
          <div className="space-y-6">
            {/* Student Selection Card */}
            <Card className="overflow-visible">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      Select Student
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Search by name or student ID
                    </p>
                  </div>
                </div>

                {selectedStudent ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden">
                      {selectedStudent.photo ? (
                        <img
                          src={selectedStudent.photo}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary truncate">
                        {selectedStudent.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span className="font-mono">
                          {selectedStudent.studentId}
                        </span>
                        {selectedStudent.className && (
                          <>
                            <span>•</span>
                            <span>{selectedStudent.className}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearStudent}
                      className="p-1.5 rounded-full hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative" ref={studentDropdownRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                      <input
                        type="text"
                        placeholder="Search students..."
                        value={studentSearch}
                        onChange={(e) => {
                          setStudentSearch(e.target.value);
                          setShowStudentDropdown(true);
                        }}
                        onFocus={() => setShowStudentDropdown(true)}
                        className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    </div>

                    {showStudentDropdown && (
                      <div className="absolute z-50 w-full mt-2 bg-card rounded-xl border border-border shadow-xl max-h-64 overflow-y-auto">
                        {studentsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          </div>
                        ) : students.length === 0 ? (
                          <div className="py-8 text-center text-text-secondary text-sm">
                            {studentSearch
                              ? "No students found"
                              : "Type to search students"}
                          </div>
                        ) : (
                          <div className="py-1">
                            {students.map((student) => (
                              <button
                                key={student.id}
                                type="button"
                                onClick={() => handleSelectStudent(student)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-hover transition-colors text-left"
                              >
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                                  {student.photo ? (
                                    <img
                                      src={student.photo}
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <User className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-text-primary truncate">
                                    {student.full_name}
                                  </p>
                                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                                    <span className="font-mono">
                                      {student.student_id}
                                    </span>
                                    {student.current_class_name && (
                                      <>
                                        <span>•</span>
                                        <span>
                                          {student.current_class_name}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {errors.student_id && (
                  <p className="mt-2 text-xs text-error">
                    {errors.student_id.message}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Book Selection Card */}
            <Card className="overflow-visible">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Book className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      Select Book Copy
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Search by title, author, or barcode
                    </p>
                  </div>
                </div>

                {selectedBook ? (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-success/5 border border-success/20">
                    <div className="h-16 w-12 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Book className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-text-primary line-clamp-1">
                        {selectedBook.library_item_title}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {selectedBook.library_item_author}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs">
                        <span className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                          {selectedBook.barcode}
                        </span>
                        <span className="flex items-center gap-1 text-text-secondary">
                          <MapPin className="h-3 w-3" />
                          {selectedBook.shelf_location}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearBook}
                      className="p-1.5 rounded-full hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="relative" ref={bookDropdownRef}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                      <input
                        type="text"
                        placeholder="Search available books..."
                        value={bookSearch}
                        onChange={(e) => {
                          setBookSearch(e.target.value);
                          setShowBookDropdown(true);
                        }}
                        onFocus={() => setShowBookDropdown(true)}
                        className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-surface text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      />
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
                    </div>

                    {showBookDropdown && (
                      <div className="absolute z-50 w-full mt-2 bg-card rounded-xl border border-border shadow-xl max-h-72 overflow-y-auto">
                        {copiesLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          </div>
                        ) : availableCopies.length === 0 ? (
                          <div className="py-8 text-center text-text-secondary text-sm">
                            {bookSearch
                              ? "No available books found"
                              : "Type to search books"}
                          </div>
                        ) : (
                          <div className="py-1">
                            {availableCopies.map((copy) => (
                              <button
                                key={copy.id}
                                type="button"
                                onClick={() => handleSelectBook(copy)}
                                className="w-full flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors text-left"
                              >
                                <div className="h-12 w-9 rounded-md bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center flex-shrink-0">
                                  <Book className="h-4 w-4 text-secondary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-text-primary line-clamp-1">
                                    {copy.library_item_title}
                                  </p>
                                  <p className="text-xs text-text-secondary">
                                    {copy.library_item_author}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1 text-xs">
                                    <span className="font-mono text-primary">
                                      {copy.barcode}
                                    </span>
                                    <span className="text-text-secondary">
                                      • {copy.shelf_location}
                                    </span>
                                  </div>
                                </div>
                                <Badge
                                  variant="success"
                                  size="sm"
                                  className="flex-shrink-0"
                                >
                                  Available
                                </Badge>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {errors.barcode && (
                  <p className="mt-2 text-xs text-error">
                    {errors.barcode.message}
                  </p>
                )}

                {/* Or enter barcode manually */}
                <div className="mt-4 pt-4 border-t border-border">
                  <Controller
                    name="barcode"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Or enter barcode manually"
                        placeholder="Scan or type barcode..."
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (
                            e.target.value &&
                            e.target.value !== selectedBook?.barcode
                          ) {
                            setSelectedBook(null);
                          }
                        }}
                        leftIcon={<Hash className="h-4 w-4" />}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Issue Details Card */}
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Calendar className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary">
                      Issue Details
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Set due date and add notes
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Controller
                    name="due_date"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Due Date"
                        type="date"
                        {...field}
                        error={errors.due_date?.message}
                      />
                    )}
                  />

                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">
                          Notes (Optional)
                        </label>
                        <textarea
                          placeholder="Add any notes about this issue..."
                          {...field}
                          rows={3}
                          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-card focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                        />
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & Submit */}
          <div className="space-y-6">
            {/* Student Summary Card */}
            {selectedStudent && (
              <Card
                className={
                  studentSummary?.can_borrow && !studentSummary?.has_overdue
                    ? "border-success/30"
                    : "border-warning/30"
                }
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-text-primary">
                        Student Summary
                      </h3>
                    </div>
                    {studentSummary?.can_borrow &&
                      !studentSummary?.has_overdue && (
                        <Badge variant="success">Eligible</Badge>
                      )}
                  </div>

                  {summaryLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  ) : studentSummary ? (
                    <div className="space-y-4">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-surface">
                          <p className="text-xs text-text-secondary mb-1">
                            Current Borrows
                          </p>
                          <p className="text-lg font-bold text-text-primary">
                            {studentSummary.current_borrows}
                            <span className="text-sm font-normal text-text-secondary">
                              {" "}
                              / {studentSummary.max_borrows}
                            </span>
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-surface">
                          <p className="text-xs text-text-secondary mb-1">
                            Unpaid Fines
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              studentSummary.unpaid_fines > 0
                                ? "text-error"
                                : "text-success"
                            }`}
                          >
                            ${studentSummary.unpaid_fines.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Warnings */}
                      {studentSummary.has_overdue && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-error/10 border border-error/20">
                          <AlertTriangle className="h-5 w-5 text-error flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-error">
                              Overdue Books
                            </p>
                            <p className="text-sm text-error/80">
                              {studentSummary.overdue_count} overdue book(s).
                              Cannot issue new books until returned.
                            </p>
                          </div>
                        </div>
                      )}

                      {!studentSummary.can_borrow &&
                        !studentSummary.has_overdue && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20">
                            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-warning">
                                Borrow Limit Reached
                              </p>
                              <p className="text-sm text-warning/80">
                                Student has reached the maximum number of books
                                allowed.
                              </p>
                            </div>
                          </div>
                        )}

                      {studentSummary.can_borrow &&
                        !studentSummary.has_overdue && (
                          <div className="flex items-start gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                            <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-medium text-success">
                                Ready to Borrow
                              </p>
                              <p className="text-sm text-success/80">
                                Student is eligible to borrow books.
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  ) : (
                    <p className="text-center text-text-secondary py-4">
                      Could not load student summary
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Book Preview Card */}
            {selectedBook && (
              <Card className="border-success/30">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Book className="h-5 w-5 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-text-primary">
                      Book Details
                    </h3>
                  </div>

                  <div className="flex gap-4">
                    <div className="h-28 w-20 rounded-lg bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center flex-shrink-0 border border-border">
                      <Book className="h-8 w-8 text-secondary/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-text-primary line-clamp-2">
                        {selectedBook.library_item_title}
                      </h4>
                      <p className="text-sm text-text-secondary mt-1">
                        {selectedBook.library_item_author}
                      </p>
                      <div className="mt-3 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs">
                          <Hash className="h-3.5 w-3.5 text-text-secondary" />
                          <span className="font-mono text-primary">
                            {selectedBook.barcode}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>
                            {selectedBook.location_display ||
                              selectedBook.shelf_location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Badge
                      variant={COPY_STATUS_CONFIG[selectedBook.status].variant}
                    >
                      {COPY_STATUS_CONFIG[selectedBook.status].label}
                    </Badge>
                    <Badge variant="default" className="capitalize">
                      {selectedBook.condition}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Issue Summary & Button */}
            <Card
              className={
                canIssue
                  ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20"
                  : ""
              }
            >
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-text-primary">
                    Issue Summary
                  </h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">Student</span>
                    <span className="text-sm font-medium text-text-primary">
                      {selectedStudent?.name || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <span className="text-sm text-text-secondary">Book</span>
                    <span className="text-sm font-medium text-text-primary line-clamp-1 max-w-[200px] text-right">
                      {selectedBook?.library_item_title || "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-text-secondary">
                      Due Date
                    </span>
                    <span className="text-sm font-medium text-text-primary">
                      {format(
                        addDays(new Date(), LIBRARY_DEFAULTS.loanPeriodDays),
                        "MMM dd, yyyy"
                      )}
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={!canIssue || issueMutation.isPending}
                  loading={issueMutation.isPending}
                  leftIcon={<CheckCircle2 className="h-5 w-5" />}
                  className="h-12 text-base font-semibold"
                >
                  {issueMutation.isPending ? "Processing..." : "Issue Book"}
                </Button>

                {!canIssue && (selectedStudent || selectedBook) && (
                  <p className="text-xs text-text-secondary text-center mt-3">
                    {!selectedStudent && "Select a student to continue"}
                    {!selectedBook &&
                      selectedStudent &&
                      "Select a book to continue"}
                    {selectedStudent &&
                      selectedBook &&
                      !studentSummary?.can_borrow &&
                      "Student cannot borrow books"}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

export default IssueBookPage;
