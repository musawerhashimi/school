import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, GraduationCap } from 'lucide-react';
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
  useClassLevel,
  useCreateClassLevel,
  useUpdateClassLevel,
} from '../hooks/useClassLevels';
import { classLevelSchema, type ClassLevelFormData } from '../schemas';

type ClassLevelFormValues = ClassLevelFormData;

export default function ClassLevelForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const levelId = isEdit ? parseInt(id, 10) : 0;

  // React Query hooks
  const { data: level, isLoading: isLoadingLevel } = useClassLevel(levelId);
  const createLevel = useCreateClassLevel();
  const updateLevel = useUpdateClassLevel();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClassLevelFormValues>({
    resolver: zodResolver(classLevelSchema),
    defaultValues: {
      is_active: true,
    },
  });

  // Load level data for edit mode
  useEffect(() => {
    if (isEdit && level) {
      setValue('level', level.level);
      setValue('name', level.name);
      setValue('category', level.category);
      setValue('moe_code', level.moe_code || '');
      setValue('description', level.description || '');
      setValue('is_active', level.is_active);
    }
  }, [isEdit, level, setValue]);

  // Form submission
  const onSubmit = (data: ClassLevelFormValues) => {
    if (isEdit) {
      updateLevel.mutate(
        { id: levelId, data },
        {
          onSuccess: () => {
            navigate('/mis/academics/levels');
          },
        }
      );
    } else {
      createLevel.mutate(data, {
        onSuccess: () => {
          navigate('/mis/academics/levels');
        },
      });
    }
  };

  if (isLoadingLevel) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading class level data..." />
      </div>
    );
  }

  const isActive = watch('is_active');
  const selectedCategory = watch('category');

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Class Level' : 'Add New Class Level'}
        subtitle={
          isEdit ? 'Update class level information' : 'Create a new class level'
        }
        actions={[
          {
            label: 'Back to List',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/levels'),
            variant: 'outline',
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-4">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-text-primary">
                  Class Level Information
                </h3>
              </div>

              <Alert variant="info" title="Afghan Education System">
                The Afghan education system consists of three categories: Primary
                (Grades 1-6), Lower Secondary (Grades 7-9), and Upper Secondary
                (Grades 10-12).
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Level Number"
                  type="number"
                  required
                  {...register('level', { valueAsNumber: true })}
                  error={errors.level?.message}
                  placeholder="11"
                  min={1}
                  max={12}
                />

                <Input
                  label="Name"
                  required
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="Grade 11"
                />

                <Select
                  label="Category"
                  required
                  {...register('category')}
                  error={errors.category?.message}
                  options={[
                    { label: 'Select category', value: '' },
                    { label: 'Primary (Grades 1-6)', value: 'primary' },
                    {
                      label: 'Lower Secondary (Grades 7-9)',
                      value: 'lower_secondary',
                    },
                    {
                      label: 'Upper Secondary (Grades 10-12)',
                      value: 'upper_secondary',
                    },
                  ]}
                />

                <Input
                  label="MoE Code (Optional)"
                  {...register('moe_code')}
                  error={errors.moe_code?.message}
                  placeholder="Ministry of Education code"
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Description (Optional)"
                    {...register('description')}
                    error={errors.description?.message}
                    placeholder="Additional information about this class level..."
                    rows={3}
                  />
                </div>

                {selectedCategory && (
                  <div className="md:col-span-2">
                    <Alert variant="info" title="Category Guide">
                      {selectedCategory === 'primary' &&
                        'Primary education (Grades 1-6): Foundation learning including basic literacy, numeracy, and general knowledge.'}
                      {selectedCategory === 'lower_secondary' &&
                        'Lower Secondary (Grades 7-9): Intermediate education focusing on core subjects and skill development.'}
                      {selectedCategory === 'upper_secondary' &&
                        'Upper Secondary (Grades 10-12): Advanced education preparing students for higher education or vocational training.'}
                    </Alert>
                  </div>
                )}

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">Active Status</p>
                      <p className="text-sm text-text-secondary">
                        Enable or disable this class level
                      </p>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => setValue('is_active', checked)}
                    />
                  </div>

                  {!isActive && (
                    <Alert variant="warning" title="Note" className="mt-4">
                      Inactive levels will not be available for class instance
                      creation and subject assignments.
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
                onClick={() => navigate('/mis/academics/levels')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="h-4 w-4" />}
                loading={createLevel.isPending || updateLevel.isPending}
              >
                {isEdit ? 'Update Class Level' : 'Create Class Level'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
