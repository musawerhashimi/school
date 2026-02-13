import { Card } from "@mis-components/ui";
import DocumentManager from "../DocumentManager";
import CommitmentFormGenerator from "../CommitmentFormGenerator";
import type { StudentApiResponse } from "../../types";

interface DocumentsTabProps {
  student: StudentApiResponse;
  studentId: number;
}

export default function DocumentsTab({ student, studentId }: DocumentsTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <DocumentManager studentId={studentId} />
      </Card>

      {/* Commitment Form Generator */}
      {student && <CommitmentFormGenerator student={student} />}
    </div>
  );
}
