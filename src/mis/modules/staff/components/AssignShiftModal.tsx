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
  Spinner,
} from "@mis-components/ui";
import { useAssignShift } from "../hooks/useStaff";
import { useShifts } from "../hooks/useShifts";
import {
  assignShiftSchema,
  type AssignShiftFormData,
} from "../schemas/staffSchema";

interface AssignShiftModalProps {
  staffId: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AssignShiftModal({
  staffId,
  onSuccess,
  onCancel,
}: AssignShiftModalProps) {
  const { t } = useTranslation();

  // Fetch available shifts
  const { data: shiftsData, isLoading: isLoadingShifts } = useShifts({
    is_active: true,
  });

  const assignShift = useAssignShift();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<AssignShiftFormData>({
    resolver: zodResolver(assignShiftSchema),
    defaultValues: {
      is_active: true,
      effective_from: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: AssignShiftFormData) => {
    assignShift.mutate(
      { staffId, data },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  if (isLoadingShifts) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  const shifts = shiftsData?.results || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Alert variant="info">
        Assign a work shift to this staff member. They can be assigned to
        multiple shifts.
      </Alert>

      <Select
        label={t("mis.staff.shifts.shiftName")}
        {...register("shift", { valueAsNumber: true })}
        error={errors.shift?.message}
        required
        options={shifts.map((shift) => ({
          label: `${shift.name} (${shift.start_time} - ${shift.end_time}`,
          value: shift.id.toString(),
        }))}
      />

      {shifts.length === 0 && (
        <Alert variant="warning">
          No active shifts available. Please create a shift first.
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t("mis.staff.salary.effectiveFrom")}
          type="date"
          {...register("effective_from")}
          error={errors.effective_from?.message}
          required
        />

        <Input
          label={t("mis.staff.salary.effectiveTo")}
          type="date"
          {...register("effective_to")}
          error={errors.effective_to?.message}
          helperText="Leave empty for ongoing assignment"
        />
      </div>

      <Textarea
        label={t("mis.staff.fields.notes")}
        {...register("notes")}
        error={errors.notes?.message}
        rows={3}
        placeholder="Additional notes about this shift assignment..."
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          {...register("is_active")}
          className="rounded border-border"
        />
        <label
          htmlFor="is_active"
          className="text-sm font-medium text-text-primary"
        >
          {t("mis.staff.shifts.isActive")}
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            {t("mis.common.cancel")}
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isSubmitting || assignShift.isPending}
          leftIcon={<Save className="h-4 w-4" />}
          disabled={shifts.length === 0}
        >
          {t("mis.staff.shifts.assignShift")}
        </Button>
      </div>
    </form>
  );
}
