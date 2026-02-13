import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Users } from 'lucide-react';
import { PageHeader } from '@mis-components/index';
import {
  Button,
  Input,
  Select,
  Textarea,
  Card,
  CardContent,
  Alert,
  Spinner,
  Switch,
} from '@mis-components/ui';
import {
  useClassInstance,
  useCreateClassInstance,
  useUpdateClassInstance,
} from '../hooks/useClassInstances';
import { useAcademicYears } from '../hooks/useAcademicYears';
import { useClassLevels } from '../hooks/useClassLevels';
import { useClassrooms } from '../hooks/useClassrooms';
import { classInstanceSchema, type ClassInstanceFormData } from '../schemas';

type ClassInstanceFormValues = ClassInstanceFormData;

export default function ClassInstanceForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const classId = isEdit ? parseInt(id, 10) : 0;

  // React Query hooks
  const { data: classInstance, isLoading: isLoadingClass } = useClassInstance(classId);
  const { data: academicYearsData } = useAcademicYears({ is_active: true });
  const { data: classLevelsData } = useClassLevels({});
  const { data: classroomsData } = useClassrooms({ is_available: true });
  const createClass = useCreateClassInstance();
  const updateClass = useUpdateClassInstance();

  const academicYears = academicYearsData?.results || [];
  const classLevels = classLevelsData?.results || [];
  const classrooms = classroomsData?.results || [];

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClassInstanceFormValues>({
    resolver: zodResolver(classInstanceSchema),
    defaultValues: {
      section: 'A',
      shift: 'morning',
      gender_segregation: 'mixed',
      capacity: 30,
      is_active: true,
    },
  });

  // Load class data for edit mode
  useEffect(() => {
    if (isEdit && classInstance) {
      setValue('name', classInstance.name || '');
      setValue('academic_year', classInstance.academic_year);
      setValue('class_level', classInstance.class_level);
      setValue('physical_classroom', classInstance.physical_classroom || undefined);
      setValue('section', classInstance.section);
      setValue('shift', classInstance.shift);
      setValue('gender_segregation', classInstance.gender_segregation);
      setValue('class_teacher', classInstance.class_teacher || undefined);
      setValue('capacity', classInstance.capacity);
      setValue('is_active', classInstance.is_active);
      setValue('description', classInstance.description || '');
      setValue('notes', classInstance.notes || '');
    }
  }, [isEdit, classInstance, setValue]);

  // Form submission
  const onSubmit = (data: ClassInstanceFormValues) => {
    // Clean up data
    const cleanData = {
      ...data,
      physical_classroom: data.physical_classroom || undefined,
      class_teacher: data.class_teacher || undefined,
    };

    if (isEdit) {
      updateClass.mutate(
        { id: classId, data: cleanData },
        {
          onSuccess: () => {
            navigate('/mis/academics/classes');
          },
        }
      );
    } else {
      createClass.mutate(cleanData, {
        onSuccess: () => {
          navigate('/mis/academics/classes');
        },
      });
    }
  };

  if (isLoadingClass) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading class data..." />
      </div>
    );
  }

  const isActive = watch('is_active');
  const selectedShift = watch('shift');
  const selectedGender = watch('gender_segregation');
  const selectedLevel = watch('class_level');
  const capacity = watch('capacity');

  // Find selected level details
  const selectedLevelData = classLevels.find((l) => l.id === selectedLevel);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Class' : 'Create New Class'}
        subtitle={
          isEdit
            ? 'Update class information and settings'
            : 'Create a new class instance for an academic year'
        }
        actions={[
          {
            label: 'Back to List',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/classes'),
            variant: 'outline',
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                  <Users className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-text-primary">
                    Class Configuration
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Academic Year"
                    required
                    {...register('academic_year', { valueAsNumber: true })}
                    error={errors.academic_year?.message}
                    options={[
                      { label: 'Select academic year', value: '' },
                      ...academicYears.map((y) => ({
                        label: `${y.display_name}${y.is_current ? ' (Current)' : ''}`,
                        value: String(y.id),
                      })),
                    ]}
                  />

                  <Select
                    label="Class Level"
                    required
                    {...register('class_level', { valueAsNumber: true })}
                    error={errors.class_level?.message}
                    options={[
                      { label: 'Select class level', value: '' },
                      ...classLevels.map((l) => ({
                        label: `${l.name} (${l.category_display})`,
                        value: String(l.id),
                      })),
                    ]}
                  />

                  <Input
                    label="Section"
                    required
                    {...register('section')}
                    error={errors.section?.message}
                    placeholder="A"
                    maxLength={10}
                  />

                  <Input
                    label="Custom Name (Optional)"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="Leave empty for auto-generated name"
                  />

                  <Select
                    label="Physical Classroom"
                    {...register('physical_classroom', {
                      setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
                    })}
                    error={errors.physical_classroom?.message}
                    options={[
                      { label: 'Select classroom (optional)', value: '' },
                      ...classrooms.map((c) => ({
                        label: `${c.room_number} - ${c.room_name} (Capacity: ${c.capacity})`,
                        value: String(c.id),
                      })),
                    ]}
                  />

                  <Input
                    label="Capacity"
                    type="number"
                    required
                    {...register('capacity', { valueAsNumber: true })}
                    error={errors.capacity?.message}
                    placeholder="30"
                    min={1}
                    max={200}
                  />
                </div>

                {selectedLevelData && (
                  <Alert variant="info" title={`${selectedLevelData.name} Information`}>
                    Category: {selectedLevelData.category_display}
                    {selectedLevelData.minimum_age && (
                      <> | Minimum Age: {selectedLevelData.minimum_age} years</>
                    )}
                    {selectedLevelData.subjects_count !== undefined && (
                      <> | Subjects: {selectedLevelData.subjects_count}</>
                    )}
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Schedule & Policy */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary border-b pb-4">
                  Schedule & Policy
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Shift"
                    required
                    {...register('shift')}
                    error={errors.shift?.message}
                    options={[
                      { label: 'Morning (7:00 AM - 12:00 PM)', value: 'morning' },
                      { label: 'Afternoon (12:00 PM - 5:00 PM)', value: 'afternoon' },
                      { label: 'Evening (5:00 PM - 9:00 PM)', value: 'evening' },
                    ]}
                  />

                  <Select
                    label="Gender Policy"
                    required
                    {...register('gender_segregation')}
                    error={errors.gender_segregation?.message}
                    options={[
                      { label: 'Mixed (Both Genders)', value: 'mixed' },
                      { label: 'Male Only', value: 'male_only' },
                      { label: 'Female Only', value: 'female_only' },
                    ]}
                  />
                </div>

                {selectedShift && (
                  <Alert
                    variant="info"
                    title={`${selectedShift.charAt(0).toUpperCase() + selectedShift.slice(1)} Shift`}
                  >
                    {selectedShift === 'morning' &&
                      'This class will run from 7:00 AM to 12:00 PM.'}
                    {selectedShift === 'afternoon' &&
                      'This class will run from 12:00 PM to 5:00 PM.'}
                    {selectedShift === 'evening' &&
                      'This class will run from 5:00 PM to 9:00 PM.'}
                  </Alert>
                )}

                {selectedGender !== 'mixed' && (
                  <Alert variant="warning" title="Gender Restriction">
                    {selectedGender === 'male_only' &&
                      'Only male students can be enrolled in this class.'}
                    {selectedGender === 'female_only' &&
                      'Only female students can be enrolled in this class.'}
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-text-primary border-b pb-4">
                  Additional Information
                </h3>

                <div className="grid grid-cols-1 gap-6">
                  <Textarea
                    label="Description (Optional)"
                    {...register('description')}
                    error={errors.description?.message}
                    placeholder="Additional information about this class..."
                    rows={3}
                  />

                  <Textarea
                    label="Notes (Optional)"
                    {...register('notes')}
                    error={errors.notes?.message}
                    placeholder="Internal notes..."
                    rows={2}
                  />

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">Active Status</p>
                      <p className="text-sm text-text-secondary">
                        Enable or disable this class
                      </p>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => setValue('is_active', checked)}
                    />
                  </div>

                  {!isActive && (
                    <Alert variant="warning" title="Note">
                      Inactive classes will not accept new enrollments and won't
                      appear in student assignment dropdowns.
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary */}
          {(selectedLevel || capacity) && (
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-text-primary border-b pb-4">
                  Summary
                </h3>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedLevelData && (
                    <div>
                      <p className="text-sm text-text-secondary">Class Level</p>
                      <p className="font-medium">{selectedLevelData.name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-text-secondary">Capacity</p>
                    <p className="font-medium">{capacity} students</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Shift</p>
                    <p className="font-medium capitalize">{selectedShift}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">Gender Policy</p>
                    <p className="font-medium capitalize">
                      {selectedGender?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit Button */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate('/mis/academics/classes')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={<Save className="h-4 w-4" />}
                  loading={createClass.isPending || updateClass.isPending}
                >
                  {isEdit ? 'Update Class' : 'Create Class'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
