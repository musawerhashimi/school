import {
  Alert,
  Badge,
  Button,
  Input,
  Modal,
  Select,
  Textarea,
} from "@mis-components/ui";
import {
  Calendar,
  Clock,
  Edit,
  MapPin,
  Save,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useClassrooms } from "../../reference/hooks/useClassrooms";
import { useTeachers } from "../../teachers/hooks/useTeachers";
import { useAvailableScheduleSubjects } from "../hooks/useClassExams";
import {
  useCreateExamSchedule,
  useDeleteExamSchedule,
  useUpdateExamSchedule,
} from "../hooks/useExamSchedules";
import type {
  CreateExamScheduleData,
  ExamScheduleDetailApiResponse,
} from "../types";

interface ExamScheduleSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: number;
  examId: number;
  slot?: ExamScheduleDetailApiResponse | null;
  createMode?: boolean;
  prefilledDate?: string; // Date pre-filled when clicking an empty slot
}

export default function ExamScheduleSlotModal({
  isOpen,
  onClose,
  classId,
  examId,
  slot,
  createMode = false,
  prefilledDate,
}: ExamScheduleSlotModalProps) {
  const [isEditing, setIsEditing] = useState(createMode);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<CreateExamScheduleData>>({
    exam: examId,
    class_instance: classId,
    subject: slot?.subject,
    exam_date: slot?.exam_date || "",
    start_time: slot?.start_time || "08:00",
    end_time: slot?.end_time || "10:00",
    room: slot?.room,
    invigilators: slot?.invigilators || [],
    notes: slot?.notes || "",
  });

  const {
    data: availableSubjects,
    isLoading: isLoadingAvailableSubjects,
  } = useAvailableScheduleSubjects(classId, examId, slot?.id, {
    enabled: isOpen && classId > 0 && examId > 0,
  });
  const { data: classrooms } = useClassrooms();
  const { data: teachersData } = useTeachers();

  const createExamSchedule = useCreateExamSchedule();
  const updateExamSchedule = useUpdateExamSchedule();
  const deleteExamSchedule = useDeleteExamSchedule();

  const teachers = teachersData?.results || [];
  const hasAnyAvailableSubject = (availableSubjects?.length || 0) > 0;
  const canValidateSubject = !isLoadingAvailableSubjects && Array.isArray(availableSubjects);
  const selectedSubjectIsUnavailable =
    canValidateSubject &&
    typeof formData.subject === "number" &&
    !availableSubjects.some((subject) => subject.id === formData.subject);

  useEffect(() => {
    setSubmitError(null);
    if (slot) {
      setFormData({
        exam: examId,
        class_instance: classId,
        subject: slot.subject,
        exam_date: slot.exam_date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        room: slot.room,
        invigilators: slot.invigilators || [],
        notes: slot.notes || "",
      });
      setIsEditing(false);
    } else if (createMode) {
      setFormData({
        exam: examId,
        class_instance: classId,
        subject: undefined,
        exam_date: prefilledDate || "",
        start_time: "08:00",
        end_time: "10:00",
        room: undefined,
        invigilators: [],
        notes: "",
      });
      setIsEditing(true);
    }
  }, [slot, createMode, examId, classId, prefilledDate]);

  const getErrorMessage = (error: unknown): string => {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      typeof (error as { response?: unknown }).response === "object"
    ) {
      const response = (error as { response?: { data?: unknown } }).response;
      const data = response?.data;
      if (typeof data === "string") {
        return data;
      }
      if (typeof data === "object" && data !== null) {
        const payload = data as Record<string, unknown>;
        const nonFieldErrors = payload.non_field_errors;
        if (Array.isArray(nonFieldErrors) && nonFieldErrors.length > 0) {
          const firstError = String(nonFieldErrors[0]);
          if (firstError.includes("must make a unique set")) {
            return "This subject is already scheduled for this exam and class. Please choose another subject.";
          }
          return firstError;
        }
        if (typeof payload.error === "string") {
          return payload.error;
        }
      }
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "Failed to save schedule. Please resolve conflicts and try again.";
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    if (
      !formData.subject ||
      !formData.exam_date ||
      !formData.start_time ||
      !formData.end_time
    ) {
      setSubmitError("Subject, date, start time, and end time are required.");
      return;
    }
    if (selectedSubjectIsUnavailable) {
      setSubmitError(
        "This subject is already scheduled for this exam and class. Please choose another subject."
      );
      return;
    }

    const data: CreateExamScheduleData = {
      exam: examId,
      class_instance: classId,
      subject: formData.subject!,
      exam_date: formData.exam_date!,
      start_time: formData.start_time!,
      end_time: formData.end_time!,
      room: formData.room,
      invigilators: formData.invigilators,
      notes: formData.notes,
    };

    if (createMode) {
      createExamSchedule.mutate(data, {
        onSuccess: onClose,
        onError: (error) => setSubmitError(getErrorMessage(error)),
      });
    } else if (slot) {
      updateExamSchedule.mutate(
        { id: slot.id, data },
        {
          onSuccess: onClose,
          onError: (error) => setSubmitError(getErrorMessage(error)),
        }
      );
    }
  };

  const handleDelete = () => {
    if (slot) {
      deleteExamSchedule.mutate(slot.id, { onSuccess: onClose });
    }
  };

  const isSaving = createExamSchedule.isPending || updateExamSchedule.isPending;
  const isDeleting = deleteExamSchedule.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        createMode
          ? "Add Exam Schedule"
          : isEditing
          ? "Edit Exam Schedule"
          : "Schedule Details"
      }
      size="lg"
    >
      <div className="space-y-6">
        {submitError && (
          <Alert variant="error" title="Schedule Conflict">
            {submitError}
          </Alert>
        )}
        {isEditing && createMode && canValidateSubject && !hasAnyAvailableSubject && (
          <Alert variant="warning" title="No Subjects Available">
            All subjects for this class are already scheduled in this exam.
          </Alert>
        )}
        {isEditing ? (
          /* Edit Mode */
          <div className="space-y-4">
            <Select
              label="Subject *"
              value={String(formData.subject || "")}
              onChange={(e) => {
                const selectedSubject = e.target.value
                  ? parseInt(e.target.value, 10)
                  : undefined;
                const isUnavailable =
                  canValidateSubject &&
                  typeof selectedSubject === "number" &&
                  !availableSubjects.some((subject) => subject.id === selectedSubject);

                setFormData({
                  ...formData,
                  subject: selectedSubject,
                });

                if (isUnavailable) {
                  setSubmitError(
                    "This subject is already scheduled for this exam and class. Please choose another subject."
                  );
                } else {
                  setSubmitError(null);
                }
              }}
              options={[
                {
                  label: isLoadingAvailableSubjects
                    ? "Loading subjects..."
                    : hasAnyAvailableSubject
                    ? "Select Subject"
                    : "No subjects available",
                  value: "",
                },
                ...(availableSubjects || []).map((s) => ({
                  label: `${s.name} (${s.code})`,
                  value: String(s.id),
                })),
              ]}
            />

            {/* Show date info banner if prefilled, otherwise show date picker */}
            {prefilledDate && createMode ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-info-soft)] border border-[var(--color-primary)]/20">
                <Calendar className="h-5 w-5 text-[var(--color-primary)]" />
                <div>
                  <p className="text-xs text-[var(--color-text-secondary)]">Exam Date</p>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    {new Date(prefilledDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ) : null}

            <div className={`grid gap-4 ${prefilledDate && createMode ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
              {/* Only show date picker if no prefilled date */}
              {!(prefilledDate && createMode) && (
                <Input
                  label="Date *"
                  type="date"
                  value={formData.exam_date || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, exam_date: e.target.value })
                  }
                />
              )}
              <Input
                label="Start Time *"
                type="time"
                value={formData.start_time || ""}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
              />
              <Input
                label="End Time *"
                type="time"
                value={formData.end_time || ""}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
              />
            </div>

            <Select
              label="Room"
              value={String(formData.room || "")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  room: e.target.value ? parseInt(e.target.value) : undefined,
                })
              }
              options={[
                { label: "Select Room", value: "" },
                ...(classrooms?.results || []).map((r) => ({
                  label: `${r.room_number} - ${r.room_name || "Classroom"}`,
                  value: String(r.id),
                })),
              ]}
            />

            <Select
              label="Invigilator"
              value={String(formData.invigilators?.[0] || "")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  invigilators: e.target.value
                    ? [parseInt(e.target.value)]
                    : [],
                })
              }
              options={[
                { label: "Select Invigilator", value: "" },
                ...teachers.map((t) => ({
                  label: t.full_name,
                  value: String(t.id),
                })),
              ]}
            />

            <Textarea
              label="Notes"
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes about this exam slot..."
              rows={3}
            />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                loading={isSaving}
                disabled={
                  isLoadingAvailableSubjects ||
                  (createMode && !hasAnyAvailableSubject) || selectedSubjectIsUnavailable
                }
                leftIcon={<Save className="h-4 w-4" />}
              >
                {createMode ? "Create" : "Save Changes"}
              </Button>
            </div>
          </div>
        ) : (
          /* View Mode */
          slot && (
            <div className="space-y-6">
              {/* Subject Header */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secondary)]/10 border border-[var(--color-primary)]/20">
                <div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">
                    {slot.subject_name}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">{slot.subject_code}</p>
                </div>
                {slot.is_completed ? (
                  <Badge variant="success">Completed</Badge>
                ) : slot.is_upcoming ? (
                  <Badge variant="info">Upcoming</Badge>
                ) : slot.is_ongoing ? (
                  <Badge variant="warning">Ongoing</Badge>
                ) : (
                  <Badge variant="secondary">Past</Badge>
                )}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                  <div className="p-2 rounded-lg bg-[var(--color-info-soft)]">
                    <Calendar className="h-4 w-4 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)]">Date</p>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {slot.day_name}, {new Date(slot.exam_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                  <div className="p-2 rounded-lg bg-[var(--color-warning-soft)]">
                    <Clock className="h-4 w-4 text-[var(--color-warning)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)]">Time</p>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {slot.start_time?.slice(0, 5)} - {slot.end_time?.slice(0, 5)}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {slot.duration_minutes} minutes
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                  <div className="p-2 rounded-lg bg-[var(--color-success-soft)]">
                    <MapPin className="h-4 w-4 text-[var(--color-success)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)]">Room</p>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {slot.room_detail?.room_number || slot.room_detail?.room_name || "Not assigned"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                  <div className="p-2 rounded-lg bg-[var(--color-info-soft)]">
                    <User className="h-4 w-4 text-[var(--color-info)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-text-secondary)]">Teacher</p>
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {slot.teacher_detail?.full_name || "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Invigilators */}
              {slot.invigilators_detail &&
                slot.invigilators_detail.length > 0 && (
                  <div className="p-4 bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)]">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-[var(--color-text-secondary)]" />
                      <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                        Invigilators
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {slot.invigilators_detail.map((inv) => (
                        <Badge key={inv.id} variant="secondary">
                          {inv.full_name || 'Unknown'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

              {/* Notes */}
              {slot.notes && (
                <div className="p-4 bg-[var(--color-info-soft)] rounded-xl border border-[var(--color-primary)]/20">
                  <p className="text-sm text-[var(--color-text-primary)]">{slot.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t border-[var(--color-border)]">
                <Button
                  variant="ghost"
                  onClick={handleDelete}
                  loading={isDeleting}
                  leftIcon={<Trash2 className="h-4 w-4" />}
                  className="text-[var(--color-danger)] hover:text-[var(--color-danger)] hover:bg-[var(--color-error-soft)]"
                >
                  Delete
                </Button>
                <div className="flex gap-3">
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setIsEditing(true)}
                    leftIcon={<Edit className="h-4 w-4" />}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </Modal>
  );
}
