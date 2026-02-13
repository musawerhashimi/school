import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, DoorOpen } from 'lucide-react';
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
  useClassroom,
  useCreateClassroom,
  useUpdateClassroom,
} from '../hooks/useClassrooms';
import { classroomSchema, type ClassroomFormData } from '../schemas';

type ClassroomFormValues = ClassroomFormData;

export default function ClassroomForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = id && id !== 'new';
  const classroomId = isEdit ? parseInt(id, 10) : 0;

  // React Query hooks
  const { data: classroom, isLoading: isLoadingClassroom } = useClassroom(classroomId);
  const createClassroom = useCreateClassroom();
  const updateClassroom = useUpdateClassroom();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ClassroomFormValues>({
    resolver: zodResolver(classroomSchema),
    defaultValues: {
      room_type: 'classroom',
      is_available: true,
    },
  });

  // Load classroom data for edit mode
  useEffect(() => {
    if (isEdit && classroom) {
      setValue('room_number', classroom.room_number);
      setValue('room_name', classroom.room_name);
      setValue('room_type', classroom.room_type);
      setValue('capacity', classroom.capacity);
      setValue('building', classroom.building || '');
      setValue('floor_number', classroom.floor_number || undefined);
      setValue('facilities', classroom.facilities || '');
      setValue('description', classroom.description || '');
      setValue('is_available', classroom.is_available);
    }
  }, [isEdit, classroom, setValue]);

  // Form submission
  const onSubmit = (data: ClassroomFormValues) => {
    if (isEdit) {
      updateClassroom.mutate(
        { id: classroomId, data },
        {
          onSuccess: () => {
            navigate('/mis/academics/classrooms');
          },
        }
      );
    } else {
      createClassroom.mutate(data, {
        onSuccess: () => {
          navigate('/mis/academics/classrooms');
        },
      });
    }
  };

  if (isLoadingClassroom) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading classroom data..." />
      </div>
    );
  }

  const isAvailable = watch('is_available');
  const roomType = watch('room_type');

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Classroom' : 'Add New Classroom'}
        subtitle={
          isEdit ? 'Update classroom information' : 'Create a new physical classroom'
        }
        actions={[
          {
            label: 'Back to List',
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate('/mis/academics/classrooms'),
            variant: 'outline',
          },
        ]}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2 border-b pb-4">
                <DoorOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-text-primary">
                  Classroom Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Room Number"
                  required
                  {...register('room_number')}
                  error={errors.room_number?.message}
                  placeholder="101"
                />

                <Input
                  label="Room Name"
                  required
                  {...register('room_name')}
                  error={errors.room_name?.message}
                  placeholder="Main Classroom A"
                />

                <Select
                  label="Room Type"
                  required
                  {...register('room_type')}
                  error={errors.room_type?.message}
                  options={[
                    { label: 'Classroom', value: 'classroom' },
                    { label: 'Laboratory', value: 'lab' },
                    { label: 'Computer Lab', value: 'computer_lab' },
                    { label: 'Library', value: 'library' },
                    { label: 'Hall', value: 'hall' },
                    { label: 'Outdoor', value: 'outdoor' },
                    { label: 'Workshop', value: 'workshop' },
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
                />

                <Input
                  label="Building (Optional)"
                  {...register('building')}
                  error={errors.building?.message}
                  placeholder="Main Building"
                />

                <Input
                  label="Floor Number (Optional)"
                  type="number"
                  {...register('floor_number', {
                    setValueAs: (v) => (v === '' ? undefined : parseInt(v, 10)),
                  })}
                  error={errors.floor_number?.message}
                  placeholder="1"
                  min={0}
                />

                <div className="md:col-span-2">
                  <Textarea
                    label="Facilities (Optional)"
                    {...register('facilities')}
                    error={errors.facilities?.message}
                    placeholder="Projector, whiteboard, air conditioning, etc."
                    rows={2}
                  />
                </div>

                <div className="md:col-span-2">
                  <Textarea
                    label="Description (Optional)"
                    {...register('description')}
                    error={errors.description?.message}
                    placeholder="Additional information about this classroom..."
                    rows={3}
                  />
                </div>

                {roomType && roomType !== 'classroom' && (
                  <div className="md:col-span-2">
                    <Alert variant="info" title="Room Type Guide">
                      {roomType === 'lab' &&
                        'Laboratory: Specialized room for science experiments and practical work.'}
                      {roomType === 'computer_lab' &&
                        'Computer Lab: Room equipped with computers for IT education and digital learning.'}
                      {roomType === 'library' &&
                        'Library: Reading and study space with book collections and resources.'}
                      {roomType === 'hall' &&
                        'Hall: Large space for assemblies, events, and gatherings.'}
                      {roomType === 'outdoor' &&
                        'Outdoor: Open-air space for physical education and outdoor activities.'}
                      {roomType === 'workshop' &&
                        'Workshop: Practical training space for vocational and technical education.'}
                    </Alert>
                  </div>
                )}

                <div className="md:col-span-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-text-primary">
                        Availability Status
                      </p>
                      <p className="text-sm text-text-secondary">
                        Mark this classroom as available for assignment
                      </p>
                    </div>
                    <Switch
                      checked={isAvailable}
                      onCheckedChange={(checked) =>
                        setValue('is_available', checked)
                      }
                    />
                  </div>

                  {!isAvailable && (
                    <Alert variant="warning" title="Note" className="mt-4">
                      This classroom will not be available for new class instance
                      assignments. Use this when the room is under maintenance or
                      temporarily unavailable.
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
                onClick={() => navigate('/mis/academics/classrooms')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="h-4 w-4" />}
                loading={createClassroom.isPending || updateClassroom.isPending}
              >
                {isEdit ? 'Update Classroom' : 'Create Classroom'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
