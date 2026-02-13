/**
 * BookForm Page
 * Create or edit a library book
 */

import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Save, Loader2, Image as ImageIcon, FileText } from 'lucide-react';
import Button from '@mis-components/ui/Button';
import Input from '@mis-components/ui/Input';
import Textarea from '@mis-components/ui/Textarea';
import Select from '@mis-components/ui/Select';
import Switch from '@mis-components/ui/Switch';
import FileUpload from '@mis-components/ui/FileUpload';
import { Card, CardContent, CardHeader } from '@mis-components/ui/Card';
import {
  useLibraryItem,
  useCreateLibraryItem,
  useUpdateLibraryItem,
  useCategories,
} from '../hooks/useLibrary';
import { libraryItemSchema, type LibraryItemFormData } from '../schemas/librarySchemas';
import { FORMAT_OPTIONS, LANGUAGE_OPTIONS, FILE_TYPE_OPTIONS } from '../constants';

export function BookForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  // Queries
  const { data: book, isLoading: bookLoading } = useLibraryItem(
    Number(id) || 0,
    { enabled: isEdit }
  );
  const { data: categories = [] } = useCategories();

  // Convert to options format
  const categoryOptions = useMemo(() =>
    categories.map((cat) => ({ value: cat.id.toString(), label: cat.name })),
  [categories]);

  const formatOptions = useMemo(() =>
    FORMAT_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
  []);

  const languageOptions = useMemo(() =>
    LANGUAGE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
  []);

  const fileTypeOptions = useMemo(() =>
    FILE_TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
  []);

  // Mutations
  const createMutation = useCreateLibraryItem();
  const updateMutation = useUpdateLibraryItem();

  // Form
  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<LibraryItemFormData>({
    resolver: zodResolver(libraryItemSchema),
    defaultValues: {
      title: '',
      subtitle: '',
      author: '',
      co_authors: [],
      isbn: '',
      isbn_13: '',
      publisher: '',
      publication_year: undefined,
      edition: '',
      language: 'English',
      category: undefined as unknown as number,
      tags: [],
      description: '',
      summary: '',
      table_of_contents: '',
      page_count: undefined,
      format: 'physical',
      cover_image: null,
      digital_file: null,
      file_type: '',
      is_downloadable: false,
      is_active: true,
    },
  });

  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // Load book data when editing
  useEffect(() => {
    if (book) {
      reset({
        title: book.title,
        subtitle: book.subtitle || '',
        author: book.author,
        co_authors: book.co_authors || [],
        isbn: book.isbn || '',
        isbn_13: book.isbn_13 || '',
        publisher: book.publisher || '',
        publication_year: book.publication_year || undefined,
        edition: book.edition || '',
        language: book.language || 'English',
        category: book.category,
        tags: book.tags || [],
        description: book.description || '',
        summary: book.summary || '',
        table_of_contents: book.table_of_contents || '',
        page_count: book.page_count || undefined,
        format: book.format,
        cover_image: null,
        digital_file: null,
        file_type: book.file_type || '',
        is_downloadable: book.is_downloadable,
        is_active: book.is_active,
      });

      // Set cover image preview if exists
      if (book.cover_image) {
        setCoverImagePreview(book.cover_image);
      }
    }
  }, [book, reset]);

  // Handle submit
  const onSubmit = async (data: LibraryItemFormData) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: Number(id), data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/mis/library/catalog');
    } catch {
      // Error handled by mutation
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const format = watch('format');

  if (bookLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/mis/library/catalog">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {isEdit ? 'Edit Book' : 'Add New Book'}
            </h1>
            <p className="text-sm text-text-secondary mt-1">
              {isEdit
                ? 'Update book information and media files'
                : 'Add a new book to the library catalog with cover image and digital files'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader title="Basic Information" subtitle="Enter the book's title, author, and other details" />
              <CardContent className="space-y-4">
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Title *"
                      placeholder="Enter book title"
                      error={errors.title?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="subtitle"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Subtitle"
                      placeholder="Enter subtitle (optional)"
                      error={errors.subtitle?.message}
                      {...field}
                    />
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="author"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Author *"
                        placeholder="Enter author name"
                        error={errors.author?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="publisher"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Publisher"
                        placeholder="Enter publisher"
                        error={errors.publisher?.message}
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Controller
                    name="isbn"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="ISBN"
                        placeholder="10 or 13 digits"
                        error={errors.isbn?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name="publication_year"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Publication Year"
                        type="number"
                        placeholder="YYYY"
                        error={errors.publication_year?.message}
                        value={field.value?.toString() || ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? Number(e.target.value) : undefined)
                        }
                      />
                    )}
                  />

                  <Controller
                    name="edition"
                    control={control}
                    render={({ field }) => (
                      <Input
                        label="Edition"
                        placeholder="e.g., 2nd Edition"
                        error={errors.edition?.message}
                        {...field}
                      />
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Description & Content" subtitle="Book details and summary" />
              <CardContent className="space-y-4">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      label="Description"
                      placeholder="Enter book description"
                      rows={4}
                      error={errors.description?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="summary"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      label="Summary"
                      placeholder="Brief summary (max 1000 chars)"
                      rows={3}
                      hint="A short summary shown in search results"
                      error={errors.summary?.message}
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="page_count"
                  control={control}
                  render={({ field }) => (
                    <Input
                      label="Page Count"
                      type="number"
                      placeholder="Number of pages"
                      error={errors.page_count?.message}
                      value={field.value?.toString() || ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? Number(e.target.value) : undefined)
                      }
                    />
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Media & Files"
                subtitle="Upload cover image and digital files"
              />
              <CardContent className="space-y-6">
                {/* Cover Image */}
                <div>
                  <FileUpload
                    label="Cover Image"
                    description="Upload book cover (JPG, PNG, WebP - Max 5MB)"
                    accept="image/jpeg,image/png,image/webp"
                    maxSize={5 * 1024 * 1024}
                    onFilesChange={(files) => {
                      const file = files[0] || null;
                      setValue('cover_image', file);
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setCoverImagePreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      } else {
                        setCoverImagePreview(null);
                      }
                    }}
                  />
                  {coverImagePreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-text-primary mb-2">Preview:</p>
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="h-48 w-auto rounded-lg border border-border shadow-sm object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Digital File - Only show if format is digital or both */}
                {(format === 'digital' || format === 'both') && (
                  <div className="space-y-4 p-4 bg-surface-hover rounded-lg border border-border">
                    <div className="flex items-center gap-2 text-primary">
                      <FileText className="h-5 w-5" />
                      <h4 className="font-medium">Digital Book File</h4>
                    </div>

                    <FileUpload
                      label="Digital File"
                      description="Upload digital book file (PDF, EPUB, MOBI, etc. - Max 100MB)"
                      accept=".pdf,.epub,.mobi,.azw,.doc,.docx,.txt,.html"
                      maxSize={100 * 1024 * 1024}
                      onFilesChange={(files) => {
                        setValue('digital_file', files[0] || null);
                      }}
                    />

                    <Controller
                      name="file_type"
                      control={control}
                      render={({ field }) => (
                        <Select
                          label="File Type"
                          options={fileTypeOptions}
                          placeholder="Select file type"
                          error={errors.file_type?.message}
                          hint="Specify the format of the digital file"
                          {...field}
                        />
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader
                title="Classification"
                subtitle="Organize and categorize"
              />
              <CardContent className="space-y-4">
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Category *"
                      options={categoryOptions}
                      placeholder="Select category"
                      error={errors.category?.message}
                      value={field.value?.toString() || ''}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  )}
                />

                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Language"
                      options={languageOptions}
                      error={errors.language?.message}
                      value={field.value || 'English'}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader
                title="Format & Availability"
                subtitle="Configure book format"
              />
              <CardContent className="space-y-4">
                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Book Format *"
                      options={formatOptions}
                      error={errors.format?.message}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />

                {(format === 'digital' || format === 'both') && (
                  <div className="pt-2 pb-1">
                    <Controller
                      name="is_downloadable"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          label="Allow Downloads"
                          description="Users can download the digital file"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader title="Visibility" />
              <CardContent>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      label="Active in Catalog"
                      description="Make this book visible to users"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  )}
                />
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="space-y-2 pt-6">
                <div className="flex items-start gap-3">
                  <ImageIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-1">
                      Cover Image Tips
                    </h4>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Use high-quality cover images (at least 400x600px) in JPG or PNG format for best display results.
                    </p>
                  </div>
                </div>
                {(format === 'digital' || format === 'both') && (
                  <div className="flex items-start gap-3 pt-2">
                    <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-text-primary mb-1">
                        Digital Files
                      </h4>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Supported formats: PDF, EPUB, MOBI, and more. Files are securely stored and can be made downloadable.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Link to="/mis/library/catalog">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            leftIcon={<Save className="h-4 w-4" />}
          >
            {isEdit ? 'Update Book' : 'Create Book'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default BookForm;
