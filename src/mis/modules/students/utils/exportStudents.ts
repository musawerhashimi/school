import type { StudentListApiResponse } from '../types';

/**
 * Converts student data to CSV format
 */
export function exportStudentsToCSV(
  students: StudentListApiResponse[],
  filename: string = 'students-export.csv'
): void {
  if (!students || students.length === 0) {
    alert('No students to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Student ID',
    'Full Name',
    'First Name',
    'Last Name',
    "Father's Name",
    "Grandfather's Name",
    'Date of Birth',
    'Gender',
    'Class',
    'Section',
    'Roll Number',
    'Education Level',
    'Status',
    'Admission Date',
    'Address',
    'City',
    'Province',
    'Blood Group',
    'Primary Guardian Name',
    'Primary Guardian Phone',
    'Primary Guardian Relation',
    'Emergency Contact',
    'Email',
    'Previous School',
    'Created At',
  ];

  // Convert students to CSV rows
  const rows = students.map((student) => [
    student.student_id || '',
    student.full_name || '',
    student.first_name || '',
    student.last_name || '',
    student.father_name || '',
    student.grandfather_name || '',
    student.date_of_birth || '',
    student.gender_display || '',
    student.class_name || '',
    student.section || '',
    student.roll_number || '',
    student.education_level_display || '',
    student.status_display || '',
    student.admission_date || '',
    student.address || '',
    student.city || '',
    student.province_display || '',
    student.blood_group || '',
    student.primary_guardian_name || '',
    student.primary_guardian_phone || '',
    student.primary_guardian_relation || '',
    student.emergency_contact_number || '',
    student.email || '',
    student.previous_school || '',
    student.created_at ? new Date(student.created_at).toLocaleDateString() : '',
  ]);

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        // Escape commas and quotes in cell content
        const stringCell = String(cell);
        if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
          return `"${stringCell.replace(/"/g, '""')}"`;
        }
        return stringCell;
      }).join(',')
    ),
  ].join('\n');

  // Create blob and download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports students with custom filters applied
 */
export function exportFilteredStudents(
  students: StudentListApiResponse[],
  filters: {
    search?: string;
    class_id?: number;
    section?: string;
    status?: string;
    gender?: string;
  }
): void {
  // Build filename with filter info
  const filterParts: string[] = ['students'];

  if (filters.search) {
    filterParts.push(`search-${filters.search.substring(0, 20)}`);
  }
  if (filters.class_id) {
    filterParts.push(`class-${filters.class_id}`);
  }
  if (filters.section) {
    filterParts.push(`section-${filters.section}`);
  }
  if (filters.status) {
    filterParts.push(filters.status);
  }
  if (filters.gender) {
    filterParts.push(filters.gender);
  }

  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${filterParts.join('-')}-${timestamp}.csv`;

  exportStudentsToCSV(students, filename);
}

/**
 * Export student data in Excel-friendly format
 */
export function exportStudentsToExcel(
  students: StudentListApiResponse[],
  filename: string = 'students-export.csv'
): void {
  // Excel format with tab separator for better compatibility
  if (!students || students.length === 0) {
    alert('No students to export');
    return;
  }

  const headers = [
    'Student ID',
    'Full Name',
    'First Name',
    'Last Name',
    "Father's Name",
    "Grandfather's Name",
    'Date of Birth',
    'Gender',
    'Class',
    'Section',
    'Roll Number',
    'Education Level',
    'Status',
    'Admission Date',
    'Address',
    'City',
    'Province',
    'Blood Group',
    'Primary Guardian Name',
    'Primary Guardian Phone',
    'Primary Guardian Relation',
    'Emergency Contact',
    'Email',
    'Previous School',
    'Created At',
  ];

  const rows = students.map((student) => [
    student.student_id || '',
    student.full_name || '',
    student.first_name || '',
    student.last_name || '',
    student.father_name || '',
    student.grandfather_name || '',
    student.date_of_birth || '',
    student.gender_display || '',
    student.class_name || '',
    student.section || '',
    student.roll_number || '',
    student.education_level_display || '',
    student.status_display || '',
    student.admission_date || '',
    student.address || '',
    student.city || '',
    student.province_display || '',
    student.blood_group || '',
    student.primary_guardian_name || '',
    student.primary_guardian_phone || '',
    student.primary_guardian_relation || '',
    student.emergency_contact_number || '',
    student.email || '',
    student.previous_school || '',
    student.created_at ? new Date(student.created_at).toLocaleDateString() : '',
  ]);

  // Use tab separator for Excel
  const tsvContent = [
    headers.join('\t'),
    ...rows.map((row) => row.join('\t')),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename.replace('.csv', '.tsv'));
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export minimal student list (ID, Name, Class, Status)
 */
export function exportStudentsSummary(
  students: StudentListApiResponse[],
  filename: string = 'students-summary.csv'
): void {
  if (!students || students.length === 0) {
    alert('No students to export');
    return;
  }

  const headers = [
    'Student ID',
    'Full Name',
    "Father's Name",
    'Class',
    'Section',
    'Roll Number',
    'Status',
    'Phone',
  ];

  const rows = students.map((student) => [
    student.student_id || '',
    student.full_name || '',
    student.father_name || '',
    student.class_name || '',
    student.section || '',
    student.roll_number || '',
    student.status_display || '',
    student.primary_guardian_phone || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => {
        const stringCell = String(cell);
        if (stringCell.includes(',') || stringCell.includes('"') || stringCell.includes('\n')) {
          return `"${stringCell.replace(/"/g, '""')}"`;
        }
        return stringCell;
      }).join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export students for printing (formatted nicely)
 */
export function printStudentList(students: StudentListApiResponse[]): void {
  if (!students || students.length === 0) {
    alert('No students to print');
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups to print');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student List</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        h1 {
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          font-size: 12px;
        }
        th {
          background-color: #4F46E5;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .header-info {
          text-align: center;
          margin-bottom: 30px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 10px;
          color: #666;
        }
        @media print {
          button {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header-info">
        <h1>Student List</h1>
        <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
        <p>Total Students: ${students.length}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Student ID</th>
            <th>Full Name</th>
            <th>Father's Name</th>
            <th>Class</th>
            <th>Section</th>
            <th>Roll No.</th>
            <th>Status</th>
            <th>Guardian Phone</th>
          </tr>
        </thead>
        <tbody>
          ${students.map((student, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${student.student_id || ''}</td>
              <td>${student.full_name || ''}</td>
              <td>${student.father_name || ''}</td>
              <td>${student.class_name || ''}</td>
              <td>${student.section || ''}</td>
              <td>${student.roll_number || ''}</td>
              <td>${student.status_display || ''}</td>
              <td>${student.primary_guardian_phone || ''}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>School Management Information System - Student Records</p>
      </div>

      <script>
        window.onload = function() {
          window.print();
        }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
