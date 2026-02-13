import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
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
  Badge,
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
      total_marks: 100,
      pass_marks: 40,
      is_active: true,
      class_levels: [],
    },
  });

  // Load subject data for edit mode
  useEffect(() => {
    if (isEdit && subject) {
      setValue('name', subject.name);
      setValue('code', subject.code);
      setValue('subject_type', subject.subject_type);
      setValue('class_levels', subject.class_levels || []);
      setValue('total_marks', subject.total_marks);
      setValue('pass_marks', subject.pass_marks);
      setValue('moe_code', subject.moe_code || '');
      setValue('description', subject.description || '');
      setValue('is_active', subject.is_active);
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
  const selectedLevels = watch('class_levels');
  const totalMarks = watch('total_marks');
  const passMarks = watch('pass_marks');

  const classLevels = classLevelsData?.results || [];

  return (
    <div className="space-y-6">
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
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-4">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-text-primary">
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
                />

                <Input
                  label="Subject Name"
                  required
                  {...register('name')}
                  error={errors.name?.message}
                  placeholder="Mathematics"
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
                />

                <Input
                  label="MoE Code (Optional)"
                  {...register('moe_code')}
                  error={errors.moe_code?.message}
                  placeholder="Ministry of Education code"
                />

                <Input
                  label="Total Marks"
                  type="number"
                  required
                  {...register('total_marks', { valueAsNumber: true })}
                  error={errors.total_marks?.message}
                  placeholder="100"
                  min={1}
                  max={1000}
                />

                <Input
                  label="Pass Marks"
                  type="number"
                  required
                  {...register('pass_marks', { valueAsNumber: true })}
                  error={errors.pass_marks?.message}
                  placeholder="40"
                  min={1}
                  max={1000}
                />

                {passMarks > totalMarks && (
                  <div className="md:col-span-2">
                    <Alert variant="error" title="Invalid Marks">
                      Pass marks cannot exceed total marks.
                    </Alert>
                  </div>
                )}

                {passMarks <= totalMarks && totalMarks > 0 && (
                  <div className="md:col-span-2">
                    <Alert variant="info" title="Pass Percentage">
                      Pass percentage: {((passMarks / totalMarks) * 100).toFixed(2)}%
                    </Alert>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Applicable Class Levels <span className="text-error">*</span>
                  </label>
                  <Controller
                    name="class_levels"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {classLevels.map((level) => (
                            <label
                              key={level.id}
                              className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            >
                              <input
                                type="checkbox"
                                checked={field.value.includes(level.id)}
                                onChange={(e) => {
                                  const newValue = e.target.checked
                                    ? [...field.value, level.id]
                                    : field.value.filter((id) => id !== level.id);
                                  field.onChange(newValue);
                                }}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                              <span className="text-sm font-medium text-text-primary">
                                {level.name}
                              </span>
                            </label>
                          ))}
                        </div>

                        {selectedLevels.length > 0 && (
                          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm text-text-secondary">
                              Selected:
                            </span>
                            {selectedLevels.map((levelId) => {
                              const level = classLevels.find((l) => l.id === levelId);
                              return level ? (
                                <Badge key={levelId} variant="primary">
                                  {level.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        )}

                        {errors.class_levels && (
                          <p className="text-sm text-error">
                            {errors.class_levels.message}
                          </p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    label="Description (Optional)"
                    {...register('description')}
                    error={errors.description?.message}
                    placeholder="Additional information about this subject..."
                    rows={3}
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

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">Active Status</p>
                      <p className="text-sm text-text-secondary">
                        Enable or disable this subject
                      </p>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={(checked) => setValue('is_active', checked)}
                    />
                  </div>

                  {!isActive && (
                    <Alert variant="warning" title="Note" className="mt-4">
                      Inactive subjects will not be available for schedule creation
                      and exam management.
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
                onClick={() => navigate('/mis/academics/subjects')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="h-4 w-4" />}
                loading={createSubject.isPending || updateSubject.isPending}
                disabled={passMarks > totalMarks}
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
