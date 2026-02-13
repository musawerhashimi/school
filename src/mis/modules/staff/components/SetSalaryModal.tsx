import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { DollarSign, Save } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Alert,
} from "@mis-components/ui";
import { useSetSalary } from "../hooks/useStaff";
import { salarySchema, type SalaryFormData } from "../schemas/staffSchema";

interface SetSalaryModalProps {
  staffId: number;
  currentSalary?: {
    basic_salary: string;
    housing_allowance: string;
    transport_allowance: string;
  } | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function SetSalaryModal({
  staffId,
  currentSalary,
  onSuccess,
  onCancel,
}: SetSalaryModalProps) {
  const { t } = useTranslation();

  const setSalary = useSetSalary();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SalaryFormData>({
    resolver: zodResolver(salarySchema),
    defaultValues: {
      basic_salary: 0,
      housing_allowance: 0,
      transport_allowance: 0,
      is_current: true,
      effective_from: new Date().toISOString().split("T")[0],
    },
  });

  // Populate with current salary if exists
  useEffect(() => {
    if (currentSalary) {
      setValue("basic_salary", parseFloat(currentSalary.basic_salary));
      setValue("housing_allowance", parseFloat(currentSalary.housing_allowance));
      setValue("transport_allowance", parseFloat(currentSalary.transport_allowance));
    }
  }, [currentSalary, setValue]);

  const onSubmit = async (data: SalaryFormData) => {
    setSalary.mutate(
      { staffId, data },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      }
    );
  };

  // Calculate total salary
  const basicSalary = watch("basic_salary") || 0;
  const housingAllowance = watch("housing_allowance") || 0;
  const transportAllowance = watch("transport_allowance") || 0;
  const totalSalary = basicSalary + housingAllowance + transportAllowance;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Alert variant="info">
        {currentSalary
          ? "Update the salary for this staff member. This will create a new salary record."
          : "Set the initial salary for this staff member."}
      </Alert>

      {/* Salary Components */}
      <div className="space-y-4">
        <Input
          label={t("mis.staff.salary.basicSalary")}
          type="number"
          step="0.01"
          min="0"
          {...register("basic_salary", { valueAsNumber: true })}
          error={errors.basic_salary?.message}
          required
          helperText="Base salary amount in AFN"
          leftAddon="AFN"
        />

        <Input
          label={t("mis.staff.salary.housingAllowance")}
          type="number"
          step="0.01"
          min="0"
          {...register("housing_allowance", { valueAsNumber: true })}
          error={errors.housing_allowance?.message}
          helperText="Housing/accommodation allowance"
          leftAddon="AFN"
        />

        <Input
          label={t("mis.staff.salary.transportAllowance")}
          type="number"
          step="0.01"
          min="0"
          {...register("transport_allowance", { valueAsNumber: true })}
          error={errors.transport_allowance?.message}
          helperText="Transportation allowance"
          leftAddon="AFN"
        />

        {/* Total Salary Display */}
        <div className="bg-primary/10 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="font-medium text-text-primary">
                {t("mis.staff.salary.totalSalary")}
              </span>
            </div>
            <span className="text-2xl font-bold text-primary">
              AFN {totalSalary.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Effective Dates */}
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
          helperText="Leave empty for ongoing salary"
        />
      </div>

      <Textarea
        label={t("mis.staff.fields.notes")}
        {...register("notes")}
        error={errors.notes?.message}
        rows={3}
        placeholder="Additional notes about this salary update..."
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_current"
          {...register("is_current")}
          className="rounded border-border"
        />
        <label htmlFor="is_current" className="text-sm font-medium text-text-primary">
          {t("mis.staff.salary.isCurrent")}
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
          isLoading={isSubmitting || setSalary.isPending}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {currentSalary ? t("mis.staff.salary.updateSalary") : t("mis.staff.salary.setSalary")}
        </Button>
      </div>
    </form>
  );
}
