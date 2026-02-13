import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Save } from "lucide-react";
import {
  Button,
  Input,
  Select,
  Textarea,
  Alert,
} from "@mis-components/ui";
import {
  useCreateShift,
  useUpdateShift,
} from "../hooks/useShifts";
import { shiftSchema, type ShiftFormData } from "../schemas/staffSchema";
import type { ShiftApiResponse } from "../types";

interface ShiftFormProps {
  shift?: ShiftApiResponse | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ShiftForm({ shift, onSuccess, onCancel }: ShiftFormProps) {
  const { t } = useTranslation();
  const isEdit = !!shift;

  const createShift = useCreateShift();
  const updateShift = useUpdateShift();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ShiftFormData>({
    resolver: zodResolver(shiftSchema),
    defaultValues: {
      is_active: true,
      working_days: "0,1,2,3,4", // Saturday to Wednesday (Afghan work week)
    },
  });

  // Populate form with existing data in edit mode
  useEffect(() => {
    if (shift && isEdit) {
      setValue("name", shift.name);
      setValue("name_dari", shift.name_dari || "");
      setValue("name_pashto", shift.name_pashto || "");
      setValue("shift_type", shift.shift_type);
      setValue("start_time", shift.start_time);
      setValue("end_time", shift.end_time);
      setValue("working_days", shift.working_days);
      setValue("is_active", shift.is_active);
      setValue("description", shift.description || "");
    }
  }, [shift, isEdit, setValue]);

  const onSubmit = async (data: ShiftFormData) => {
    if (isEdit && shift) {
      updateShift.mutate(
        { id: shift.id, data },
        {
          onSuccess: () => {
            onSuccess?.();
          },
        }
      );
    } else {
      createShift.mutate(data, {
        onSuccess: () => {
          onSuccess?.();
        },
      });
    }
  };

  // Days checkboxes for working days
  const days = [
    { value: "0", label: "Saturday" },
    { value: "1", label: "Sunday" },
    { value: "2", label: "Monday" },
    { value: "3", label: "Tuesday" },
    { value: "4", label: "Wednesday" },
    { value: "5", label: "Thursday" },
    { value: "6", label: "Friday" },
  ];

  const workingDaysValue = watch("working_days") || "";
  const selectedDays = workingDaysValue.split(",").filter(Boolean);

  const handleDayToggle = (dayValue: string) => {
    const currentDays = selectedDays;
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter((d) => d !== dayValue)
      : [...currentDays, dayValue].sort();
    setValue("working_days", newDays.join(","));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <Input
          label={t("mis.staff.shifts.shiftName")}
          {...register("name")}
          error={errors.name?.message}
          required
          placeholder="Morning Shift"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name (Dari)"
            {...register("name_dari")}
            error={errors.name_dari?.message}
            placeholder="شیفت صبح"
            dir="rtl"
          />

          <Input
            label="Name (Pashto)"
            {...register("name_pashto")}
            error={errors.name_pashto?.message}
            placeholder="سهار شفټ"
            dir="rtl"
          />
        </div>

        <Select
          label={t("mis.staff.shifts.shiftType")}
          {...register("shift_type")}
          error={errors.shift_type?.message}
          required
          options={[
            { value: "", label: t("mis.common.select") },
            { value: "morning", label: t("mis.staff.shifts.types.morning") },
            { value: "afternoon", label: t("mis.staff.shifts.types.afternoon") },
            { value: "evening", label: t("mis.staff.shifts.types.evening") },
            { value: "custom", label: t("mis.staff.shifts.types.custom") },
          ]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={t("mis.staff.shifts.startTime")}
            type="time"
            {...register("start_time")}
            error={errors.start_time?.message}
            required
          />

          <Input
            label={t("mis.staff.shifts.endTime")}
            type="time"
            {...register("end_time")}
            error={errors.end_time?.message}
            required
          />
        </div>

        {/* Working Days */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-text-primary">
            {t("mis.staff.shifts.workingDays")} *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {days.map((day) => (
              <label
                key={day.value}
                className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedDays.includes(day.value)
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedDays.includes(day.value)}
                  onChange={() => handleDayToggle(day.value)}
                  className="rounded border-border"
                />
                <span className="text-sm font-medium">{day.label}</span>
              </label>
            ))}
          </div>
          {errors.working_days && (
            <p className="text-sm text-danger">{errors.working_days.message}</p>
          )}
          <Alert variant="info" className="mt-2">
            Afghan work week is Saturday to Wednesday (Thursday & Friday off)
          </Alert>
        </div>

        <Textarea
          label={t("mis.staff.shifts.description")}
          {...register("description")}
          error={errors.description?.message}
          rows={3}
          placeholder="Additional information about this shift..."
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="is_active"
            {...register("is_active")}
            className="rounded border-border"
          />
          <label htmlFor="is_active" className="text-sm font-medium text-text-primary">
            {t("mis.staff.shifts.isActive")}
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            {t("mis.common.cancel")}
          </Button>
        )}
        <Button
          type="submit"
          loading={isSubmitting || createShift.isPending || updateShift.isPending}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {isEdit ? t("mis.common.save") : t("mis.staff.shifts.addShift")}
        </Button>
      </div>
    </form>
  );
}
