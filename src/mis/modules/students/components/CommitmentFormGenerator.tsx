import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { FileDown, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button, Select, Card, CardContent, Alert } from "@mis-components/ui";
import CommitmentFormPDF from "./CommitmentFormPDF";
import type { StudentApiResponse } from "../types";

interface CommitmentFormGeneratorProps {
  student: StudentApiResponse;
}

const CommitmentFormGenerator: React.FC<CommitmentFormGeneratorProps> = ({
  student,
}) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "da" | "pa">("pa");

  const fileName = `commitment-form-${student.id}-${student.first_name}-${student.last_name}.pdf`;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {t("mis.student.generateCommitmentForm")}
            </h3>
            <p className="text-sm text-text-secondary">
              Generate and download a commitment form for this student in your
              preferred language.
            </p>
          </div>

          <Alert variant="info" title="About Commitment Form">
            The commitment form includes all student information, academic
            details, and the school policies commitment text. This document can
            be printed and signed by the student, guardian, and school
            principal.
          </Alert>

          {/* Language Selector */}
          <div className="max-w-xs">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Select Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value as "en" | "da" | "pa")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="pa">Pashto (پښتو)</option>
              <option value="da">Dari (دری)</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Download Button */}
          <div>
            <PDFDownloadLink
              document={
                <CommitmentFormPDF student={student} language={selectedLanguage} />
              }
              fileName={fileName}
            >
              {({ blob, url, loading, error }) => (
                <Button
                  variant="primary"
                  leftIcon={
                    loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <FileDown className="h-4 w-4" />
                    )
                  }
                  disabled={loading}
                >
                  {loading
                    ? "Generating PDF..."
                    : t("mis.student.downloadCommitmentForm")}
                </Button>
              )}
            </PDFDownloadLink>

            <p className="mt-2 text-xs text-text-secondary">
              File will be saved as: {fileName}
            </p>
          </div>

          {/* Preview Note */}
          <Alert variant="warning" title="Note">
            For RTL languages (Pashto/Dari), ensure you have the appropriate
            fonts installed for proper rendering. The PDF will be generated with
            right-to-left text direction for these languages.
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommitmentFormGenerator;
