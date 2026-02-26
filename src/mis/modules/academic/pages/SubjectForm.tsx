import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, BookOpen, Trash2, Clock } from 'lucide-react';
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
  useSubject,
  useCreateSubject,
  useUpdateSubject,
} from '../hooks/useSubjects';
import { useClassLevels } from '../hooks/useClassLevels';
import { subjectSchema, type SubjectFormData } from '../schemas';

type SubjectFormValues = SubjectFormData;

export default function SubjectForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const subjectId = isEdit ? parseInt(id, 10) : 0;

  // React Query hooks
  const { data: subject, isLoading: isLoadingSubject } = useSubject(subjectId);
  const { data: classLevelsData, isLoading: isLoadingLevels } = useClassLevels({ is_active: 'true' });
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      subject_type: 'core',
      is_active: true,
      class_levels: [],
    },
  });

  // Use field array for class levels with credit hours
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'class_levels',
  });

  // Load subject data for edit mode
  useEffect(() => {
    if (isEdit && subject) {
      setValue('name', subject.name);
      setValue('code', subject.code);
      setValue('subject_type', subject.subject_type);
      setValue('moe_code', subject.moe_code || '');
      setValue('description', subject.description || '');
      setValue('is_active', subject.is_active);
      
      // Load class levels with credit hours
      if (subject.class_levels && subject.class_levels.length > 0) {
        const levels = subject.class_levels.map((cl: any) => ({
          class_level: cl.class_level,
          credit_hours: cl.credit_hours || 1,
        }));
        setValue('class_levels', levels);
      }
    }
  }, [isEdit, subject, setValue]);

  // Form submission
  const onSubmit = (data: SubjectFormValues) => {
    if (isEdit) {
      updateSubject.mutate(
        { id: subjectId, data },
        {
          onSuccess: () => {
            navigate('/mis/academics/subjects');
          },
        }
      );
    } else {
      createSubject.mutate(data, {
        onSuccess: () => {
          navigate('/mis/academics/subjects');
        },
      });
    }
  };

  if (isLoadingSubject || isLoadingLevels) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading data..." />
      </div>
    );
  }

  const isActive = watch('is_active');
  const subjectType = watch('subject_type');
  const classLevels = classLevelsData?.results || [];

  // Get list of already selected class level IDs
  const selectedLevelIds = fields.map(f => f.class_level);

  return (
    <div className="space-y-6 dark:bg-gray-900">
      <PageHeader
        title={isEdit ? 'Edit Subject' : 'Add New Subject'}
        subtitle={
          isEdit ? 'Update subject information' : 'Create a new academic subject'
        }
        actions={[
          {
            label: 'Back to List',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/subjects'),
            variant: 'outline',
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Subject Information Card */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b dark:border-gray-600 pb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-text-primary dark:text-white">
                  Subject Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Subject Code"
                  required
                  {...register('code')}
                  error={errors.code?.message}
                  placeholder="MATH-11"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />

                <Input
                  label="Subject Name"
                  required
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="Mathematics"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />

                <Select
                  label="Subject Type"
                  required
                  {...register('subject_type')}
                  error={errors.subject_type?.message}
                  options={[
                    { label: 'Core', value: 'core' },
                    { label: 'Elective', value: 'elective' },
                    { label: 'Religious', value: 'religious' },
                    { label: 'Language', value: 'language' },
                    { label: 'Science', value: 'science' },
                    { label: 'Arts', value: 'arts' },
                    { label: 'Practical', value: 'practical' },
                  ]}
                  className="dark:bg-gray-700 dark:border-gray-600"
                />

                <Input
                  label="MoE Code (Optional)"
                  {...register('moe_code')}
                  error={errors.moe_code?.message}
                  placeholder="Ministry of Education code"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Description (Optional)"
                    {...register('description')}
                    error={errors.description?.message}
                    placeholder="Additional information about this subject..."
                    rows={3}
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {subjectType && (
                  <div className="md:col-span-2">
                    <Alert variant="info" title="Subject Type Guide">
                      {subjectType === 'core' &&
                        'Core Subject: Mandatory subject required for all students at the selected class levels.'}
                      {subjectType === 'elective' &&
                        'Elective Subject: Optional subject that students can choose based on their interests.'}
                      {subjectType === 'religious' &&
                        'Religious Subject: Islamic studies and religious education.'}
                      {subjectType === 'language' &&
                        'Language Subject: Language learning including Dari, Pashto, English, or other languages.'}
                      {subjectType === 'science' &&
                        'Science Subject: Scientific subjects including Physics, Chemistry, Biology, etc.'}
                      {subjectType === 'arts' &&
                        'Arts Subject: Creative and artistic subjects including fine arts, music, etc.'}
                      {subjectType === 'practical' &&
                        'Practical Subject: Hands-on vocational and technical training subjects.'}
                    </Alert>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class Levels Card */}
        <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b dark:border-gray-600 pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-text-primary dark:text-white">
                    Class Levels & Credit Hours
                  </h3>
                </div>
                <Select
                  className="w-48 dark:bg-gray-700 dark:border-gray-600"
                  options={[
                    { label: 'Select Class Level...', value: '' },
                    ...classLevels
                      .filter((level) => !selectedLevelIds.includes(level.id))
                      .map((level) => ({
                        label: level.name,
                        value: String(level.id),
                      })),
                  ]}
                  onChange={(e) => {
                    if (e.target.value) {
                      append({
                        class_level: parseInt(e.target.value, 10),
                        credit_hours: 1,
                      });
                      e.target.value = '';
                    }
                  }}
              
                />
              </div>

              {/* Selected Class Levels with Credit Hours */}
              {fields.length > 0 ? (
                <div className="space-y-3">
                  {fields.map((field, index) => {
                    const level = classLevels.find((l) => l.id === field.class_level);
                    return (
                      <div
                        key={field.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border dark:border-gray-600"
                      >
                        <div className="flex-1">
                          <span className="font-medium text-text-primary dark:text-white">
                            {level?.name || `Class Level ${field.class_level}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-text-secondary dark:text-gray-300">
                            Credit Hours:
                          </label>
                          <Input
                            type="number"
                            {...register(`class_levels.${index}.credit_hours` as const, {
                              valueAsNumber: true,
                            })}
                            className="w-20 text-center dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                            min={0.5}
                            max={20}
                            step={0.5}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="text-error hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary dark:text-gray-400">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No class levels selected</p>
                  <p className="text-sm mt-1">
                    Use the dropdown above to add class levels and specify credit hours
                  </p>
                </div>
              )}

              {errors.class_levels && (
                <p className="text-sm text-error">
                  {typeof errors.class_levels.message === 'string' 
                    ? errors.class_levels.message 
                    : 'At least one class level is required'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Card */}
        <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between p-4 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div>
                <p className="font-medium text-text-primary dark:text-white">Active Status</p>
                <p className="text-sm text-text-secondary dark:text-gray-400">
                  Enable or disable this subject
                </p>
              </div>
              <Switch
                checked={isActive}
                onChange={(checked) => setValue('is_active', checked)}
              />
            </div>

            {!isActive && (
              <Alert variant="warning" title="Note" className="mt-4">
                Inactive subjects will not be available for schedule creation
                and exam management.
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card className="mt-6 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/mis/academics/subjects')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="h-4 w-4" />}
                loading={createSubject.isPending || updateSubject.isPending}
              >
                {isEdit ? 'Update Subject' : 'Create Subject'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
