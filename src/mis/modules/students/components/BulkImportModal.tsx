import { useState } from 'react';
import { Upload, Download, X, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import {
  Modal,
  Button,
  Alert,
  Badge,
  Card,
  CardContent,
} from '@mis-components/ui';
import { useBulkImportStudents } from '../hooks/useStudents';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BulkImportModal({ isOpen, onClose }: BulkImportModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<{
    created_count: number;
    error_count: number;
    created: Array<{ row: number; student_id: string; name: string }>;
    errors: Array<{ row: number; error: string; data: Record<string, string> }>;
  } | null>(null);

  const bulkImport = useBulkImportStudents();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.name.endsWith('.csv')) {
        alert('Please select a CSV file');
        return;
      }
      setSelectedFile(file);
      setImportResult(null);
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;

    bulkImport.mutate(selectedFile, {
      onSuccess: (result) => {
        setImportResult(result);
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      },
    });
  };

  const handleDownloadTemplate = () => {
    // CSV template with all required columns
    const csvContent = `first_name,last_name,father_name,date_of_birth,gender,address,city,province,admission_date,education_level,guardian_first_name,guardian_last_name,guardian_phone,guardian_relation
Ahmad,Ahmadi,Mohammad,2010-05-15,male,Karte 4,Kabul,kabul,2024-01-10,upper_secondary,Mohammad,Ahmadi,0701234567,father
Fatima,Karimi,Ali,2011-03-20,female,Shar-e-Naw,Kabul,kabul,2024-01-10,lower_secondary,Ali,Karimi,0709876543,father`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'student_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setImportResult(null);
    bulkImport.reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Bulk Import Students" size="lg">
      <div className="space-y-6">
        {/* Instructions */}
        <Alert variant="info" title="Import Instructions">
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Download the CSV template below to see the required format</li>
            <li>Fill in student data following the template structure</li>
            <li>Required fields: first_name, last_name, father_name, date_of_birth, gender, address, city, province, admission_date, education_level, guardian information</li>
            <li>Date format: YYYY-MM-DD (e.g., 2010-05-15)</li>
            <li>Gender: male or female</li>
            <li>Education level: primary, lower_secondary, or upper_secondary</li>
            <li>Province: use lowercase with underscores (e.g., kabul, sar_e_pol)</li>
          </ul>
        </Alert>

        {/* Template Download */}
        <div>
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleDownloadTemplate}
            className="w-full"
          >
            Download CSV Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text-primary">
            Upload CSV File
          </label>
          <div className="flex items-center gap-3">
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="flex-1 text-sm text-text-secondary
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-white
                hover:file:bg-primary/90
                file:cursor-pointer cursor-pointer"
            />
            {selectedFile && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<X className="h-4 w-4" />}
                onClick={() => {
                  setSelectedFile(null);
                  const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
                  if (fileInput) fileInput.value = '';
                }}
              >
                Clear
              </Button>
            )}
          </div>
          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <FileText className="h-4 w-4" />
              <span>{selectedFile.name}</span>
              <Badge variant="secondary">{(selectedFile.size / 1024).toFixed(2)} KB</Badge>
            </div>
          )}
        </div>

        {/* Import Results */}
        {importResult && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-success/10 p-2">
                      <CheckCircle2 className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Successfully Imported</p>
                      <p className="text-2xl font-bold text-success">{importResult.created_count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-error/10 p-2">
                      <AlertCircle className="h-6 w-6 text-error" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary">Failed</p>
                      <p className="text-2xl font-bold text-error">{importResult.error_count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Success List */}
            {importResult.created.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Successfully Imported Students
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {importResult.created.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="success">Row {item.row}</Badge>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{item.name}</p>
                          <p className="text-xs text-text-secondary">ID: {item.student_id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error List */}
            {importResult.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-error" />
                  Import Errors
                </h4>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {importResult.errors.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 bg-error/5 border border-error/20 rounded-md space-y-2"
                    >
                      <div className="flex items-start gap-3">
                        <Badge variant="danger">Row {item.row}</Badge>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-error">{item.error}</p>
                          {Object.keys(item.data).length > 0 && (
                            <div className="mt-2 text-xs text-text-secondary">
                              <p className="font-medium">Data:</p>
                              <pre className="mt-1 p-2 bg-bg-secondary rounded overflow-x-auto">
                                {JSON.stringify(item.data, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {bulkImport.isError && (
          <Alert variant="error" title="Import Failed">
            {bulkImport.error instanceof Error
              ? bulkImport.error.message
              : 'Failed to import students. Please check your CSV file and try again.'}
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="ghost" onClick={handleClose}>
            {importResult ? 'Close' : 'Cancel'}
          </Button>
          {!importResult && (
            <Button
              variant="primary"
              leftIcon={<Upload className="h-4 w-4" />}
              onClick={handleImport}
              disabled={!selectedFile || bulkImport.isPending}
              loading={bulkImport.isPending}
            >
              Import Students
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
