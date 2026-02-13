import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Upload,
  FileText,
  Download,
  Trash2,
  Eye,
  X,
  File,
  Image,
  AlertCircle,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Input,
  Select,
  Textarea,
  Modal,
  Alert,
  Badge,
  Spinner,
} from '@mis-components/ui';
import {
  useStudentDocuments,
  useUploadStudentDocument,
  useDeleteStudentDocument,
} from '../hooks/useStudents';
import { documentUploadSchema, type DocumentUploadFormData } from '../schemas/studentSchema';

interface DocumentManagerProps {
  studentId: number;
}

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  birth_certificate: 'Birth Certificate',
  tazkira: 'Tazkira (National ID)',
  transfer_certificate: 'Transfer Certificate',
  previous_result: 'Previous School Results',
  photo: 'Student Photo',
  medical_report: 'Medical Report',
  guardian_tazkira: 'Guardian Tazkira',
  vaccination_record: 'Vaccination Record',
  other: 'Other Document',
};

export default function DocumentManager({ studentId }: DocumentManagerProps) {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: number;
    title: string;
  } | null>(null);

  // React Query hooks
  const { data: documents, isLoading } = useStudentDocuments(studentId);
  const uploadDocument = useUploadStudentDocument();
  const deleteDocument = useDeleteStudentDocument();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DocumentUploadFormData>({
    resolver: zodResolver(documentUploadSchema),
  });

  const selectedDocType = watch('document_type');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmit = (data: DocumentUploadFormData) => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    uploadDocument.mutate(
      {
        studentId,
        data: {
          ...data,
          file: selectedFile,
        },
      },
      {
        onSuccess: () => {
          setUploadModalOpen(false);
          reset();
          setSelectedFile(null);
        },
      }
    );
  };

  const handleDeleteClick = (id: number, title: string) => {
    setDocumentToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (documentToDelete) {
      deleteDocument.mutate(
        { studentId, documentId: documentToDelete.id },
        {
          onSuccess: () => {
            setDeleteModalOpen(false);
            setDocumentToDelete(null);
          },
        }
      );
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext || '')) {
      return <Image className="h-5 w-5" />;
    }
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" label="Loading documents..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Documents & Files</h3>
          <p className="text-sm text-text-secondary">
            Upload and manage student documents
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Upload className="h-4 w-4" />}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload Document
        </Button>
      </div>

      {/* Documents Grid */}
      {documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <Card key={doc.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Icon and Type */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        {getFileIcon(doc.file)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary text-sm line-clamp-1">
                          {doc.title}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {doc.document_type_display}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {doc.description && (
                    <p className="text-xs text-text-secondary line-clamp-2">
                      {doc.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <span>By: {doc.uploaded_by_name}</span>
                    <span>•</span>
                    <span>{new Date(doc.created_at).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Eye className="h-3 w-3" />}
                      onClick={() => window.open(doc.file_url, '_blank')}
                      className="flex-1"
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Download className="h-3 w-3" />}
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = doc.file_url;
                        link.download = doc.title;
                        link.click();
                      }}
                    >
                      <span className="sr-only">Download</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Trash2 className="h-3 w-3 text-error" />}
                      onClick={() => handleDeleteClick(doc.id, doc.title)}
                    >
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert variant="info" title="No Documents">
          No documents have been uploaded yet. Click the "Upload Document" button to add
          files.
        </Alert>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          reset();
          setSelectedFile(null);
        }}
        title="Upload Document"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select
            label="Document Type"
            required
            {...register('document_type')}
            error={errors.document_type?.message}
            options={[
              { label: 'Select document type', value: '' },
              ...Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />

          <Input
            label="Document Title"
            required
            {...register('title')}
            error={errors.title?.message}
            placeholder="e.g., Birth Certificate - Ahmad Ahmadi"
          />

          <Textarea
            label="Description (Optional)"
            {...register('description')}
            error={errors.description?.message}
            placeholder="Add any notes about this document..."
            rows={3}
          />

          {/* File Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-primary">
              Select File <span className="text-error">*</span>
            </label>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="w-full text-sm text-text-secondary
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/90
                file:cursor-pointer cursor-pointer"
            />
            {selectedFile && (
              <div className="flex items-center gap-2 p-2 bg-bg-secondary rounded-md">
                <File className="h-4 w-4 text-primary" />
                <span className="text-sm flex-1">{selectedFile.name}</span>
                <span className="text-xs text-text-secondary">
                  {formatFileSize(selectedFile.size)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-xs text-text-secondary">
              Supported formats: PDF, JPG, PNG, DOC, DOCX (Max 10MB)
            </p>
          </div>

          {/* Error */}
          {uploadDocument.isError && (
            <Alert variant="error" title="Upload Failed">
              {uploadDocument.error instanceof Error
                ? uploadDocument.error.message
                : 'Failed to upload document. Please try again.'}
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="ghost"
              onClick={() => {
                setUploadModalOpen(false);
                reset();
                setSelectedFile(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<Upload className="h-4 w-4" />}
              disabled={!selectedFile || uploadDocument.isPending}
              loading={uploadDocument.isPending}
            >
              Upload Document
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDocumentToDelete(null);
        }}
        title="Delete Document"
        size="sm"
      >
        {documentToDelete && (
          <div className="space-y-4">
            <Alert variant="warning" title="Warning">
              This action cannot be undone. The document will be permanently deleted.
            </Alert>

            <p className="text-text-secondary">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-text-primary">
                {documentToDelete.title}
              </span>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setDocumentToDelete(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteConfirm}
                loading={deleteDocument.isPending}
              >
                Delete Document
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
