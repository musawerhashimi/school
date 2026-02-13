import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Button,
  Input,
  Textarea,
  Card,
  CardContent,
  Alert,
  Spinner,
  Switch,
} from '@mis-components/ui';
import {
  useAcademicYear,
  useCreateAcademicYear,
  useUpdateAcademicYear,
} from '../hooks/useAcademicYears';
import { academicYearSchema, type AcademicYearFormData } from '../schemas';

type AcademicYearFormValues = AcademicYearFormData;

export default function AcademicYearForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const yearId = isEdit ? parseInt(id, 10) : 0;

  // React Query hooks
  const { data: year, isLoading: isLoadingYear } = useAcademicYear(yearId);
  const createYear = useCreateAcademicYear();
  const updateYear = useUpdateAcademicYear();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      is_current: false,
      is_active: true,
    },
  });

  // Load year data for edit mode
  useEffect(() => {
    if (isEdit && year) {
      setValue('year', year.year);
      setValue('year_gregorian', year.year_gregorian);
      setValue('start_date', year.start_date);
      setValue('end_date', year.end_date);
      setValue('is_current', year.is_current);
      setValue('is_active', year.is_active);
      setValue('description', year.description || '');
    }
  }, [isEdit, year, setValue]);

  // Form submission
  const onSubmit = (data: AcademicYearFormValues) => {
    if (isEdit) {
      updateYear.mutate(
        { id: yearId, data },
        {
          onSuccess: () => {
            navigate('/mis/academics/years');
          },
        }
      );
    } else {
      createYear.mutate(data, {
        onSuccess: () => {
          navigate('/mis/academics/years');
        },
      });
    }
  };

  if (isLoadingYear) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading academic year data..." />
      </div>
    );
  }

  const isCurrent = watch('is_current');
  const isActive = watch('is_active');

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Academic Year' : 'Add New Academic Year'}
        subtitle={
          isEdit
            ? 'Update academic year information'
            : 'Create a new academic year'
        }
        actions={[
          {
            label: 'Back to List',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/years'),
            variant: 'outline',
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-text-primary">
                  Academic Year Information
                </h3>
              </div>

              <Alert variant="info" title="Afghan Calendar System">
                This system uses the Solar Hijri (Shamsi) calendar as the primary
                calendar. Please enter the Hijri year (1400-1500 range) along with
                the corresponding Gregorian year.
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Hijri Year (Shamsi)"
                  type="number"
                  required
                  {...register('year', { valueAsNumber: true })}
                  error={errors.year?.message}
                  placeholder="1404"
                  min={1400}
                  max={1500}
                />

                <Input
                  label="Gregorian Year"
                  type="number"
                  required
                  {...register('year_gregorian', { valueAsNumber: true })}
                  error={errors.year_gregorian?.message}
                  placeholder="2025"
                  min={2020}
                  max={2100}
                />

                <Input
                  label="Start Date"
                  type="date"
                  required
                  {...register('start_date')}
                  error={errors.start_date?.message}
                />

                <Input
                  label="End Date"
                  type="date"
                  required
                  {...register('end_date')}
                  error={errors.end_date?.message}
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Description (Optional)"
                    {...register('description')}
                    error={errors.description?.message}
                    placeholder="Additional notes about this academic year..."
                    rows={3}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">
                        Set as Current Year
                      </p>
                      <p className="text-sm text-text-secondary">
                        Mark this as the active academic year
                      </p>
                    </div>
                    <Switch
                      checked={isCurrent}
                      onCheckedChange={(checked) =>
                        setValue('is_current', checked)
                      }
                    />
                  </div>

                  {isCurrent && (
                    <Alert variant="warning" title="Note">
                      Setting this year as current will automatically unmark any
                      previously current year.
                    </Alert>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">Active Status</p>
                      <p className="text-sm text-text-secondary">
                        Enable or disable this academic year
                      </p>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => setValue('is_active', checked)}
                    />
                  </div>

                  {!isActive && (
                    <Alert variant="info" title="Note">
                      Inactive years will not be visible in dropdowns and
                      selections throughout the system.
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/mis/academics/years')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="h-4 w-4" />}
                loading={createYear.isPending || updateYear.isPending}
              >
                {isEdit ? 'Update Academic Year' : 'Create Academic Year'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
