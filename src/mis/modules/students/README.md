# Student Module

Comprehensive Student Management module for the School Management Information System (MIS), built for the Afghan education system.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Components](#components)
- [Hooks](#hooks)
- [Services](#services)
- [Usage Examples](#usage-examples)
- [Integration with Other Modules](#integration-with-other-modules)
- [Afghan Education System Support](#afghan-education-system-support)

---

## Overview

The Student Module is a full-stack solution for managing student records in Afghan schools. It includes:

- **Backend**: Django REST Framework with PostgreSQL
- **Frontend**: React 19 + TypeScript + TanStack Query
- **Features**: CRUD operations, bulk import, document management, cross-module integration

### Key Technologies

- **Backend**: Django 5.0.2, Django REST Framework, django-filter
- **Frontend**: React 19.1.0, TypeScript 5.8.3, Vite 6.3.5
- **State Management**: TanStack React Query v5 (server state), Zustand (client state)
- **Validation**: Zod (frontend), Django Serializers (backend)
- **Styling**: Tailwind CSS 4.1.5
- **i18n**: react-i18next (English, Dari, Pashto)

---

## Features

### Core Features ✅

- ✅ **Student Management**: Create, Read, Update, Delete student records
- ✅ **Advanced Filtering**: Filter by class, section, status, gender, province, education level
- ✅ **Pagination**: Django REST Framework pagination (customizable page size)
- ✅ **Search**: Full-text search across name, student ID, father's name
- ✅ **Bulk Import**: CSV import with row-by-row error handling
- ✅ **Document Management**: Upload, view, download, delete student documents (9 types)
- ✅ **Export**: CSV export (full/summary), Excel-compatible TSV, Print view
- ✅ **Guardian Management**: Primary and secondary guardians with nested creation
- ✅ **Multi-step Form**: 5-step student registration form with validation
- ✅ **Profile View**: 8-tab detailed student profile

### Integration Features ✅

- ✅ **Attendance Integration**: View student attendance records and summary
- ✅ **Grades Integration**: View grades, report cards, academic performance
- ✅ **Fees Integration**: View fee records, payment history, generate receipts
- ✅ **Library Integration**: View issued books, return dates, fines
- ✅ **Student Dashboard**: Unified dashboard showing all module data
- ✅ **Pending Actions**: Alerts for overdue fees, books, low attendance

### Afghan Education System ✅

- ✅ **34 Provinces**: Full support for all Afghan provinces
- ✅ **Education Levels**: Primary (1-6), Lower Secondary (7-9), Upper Secondary (10-12)
- ✅ **Tazkira Support**: National ID field for students and guardians
- ✅ **Father/Grandfather Names**: Required fields per Afghan naming conventions
- ✅ **Multilingual**: English, Dari (RTL), Pashto (RTL)

---

## Architecture

```
students/
├── components/
│   ├── BulkImportModal.tsx       # CSV bulk import
│   └── DocumentManager.tsx       # Document upload/management
├── hooks/
│   └── useStudentIntegration.ts  # React Query hooks for integrations
├── services/
│   └── integrationService.ts     # API client for other modules
├── utils/
│   └── exportStudents.ts         # Export utilities (CSV, Excel, Print)
├── StudentList.tsx               # Main list view with filters
├── StudentForm.tsx               # 5-step create/edit form
├── StudentProfile.tsx            # 8-tab detailed view
├── StudentDashboard.tsx          # Student portal dashboard
├── index.ts                      # Module exports
└── README.md                     # This file

Shared (../../):
├── entities/Student.ts           # TypeScript types
├── services/studentService.ts    # Main API client
├── hooks/useStudents.ts          # React Query hooks
└── schemas/studentSchema.ts      # Zod validation schemas
```

---

## Components

### Main Components

#### 1. StudentList

**File**: `StudentList.tsx`

Main list view for browsing all students with advanced filtering and actions.

**Features**:
- DataTable with sortable columns
- Advanced filters (class, section, status, gender, province, education level)
- Search functionality
- Bulk actions (status update, delete)
- Export options (CSV full/summary, Print)
- Pagination with customizable page size
- Quick view/edit/delete actions

**Usage**:
```tsx
import { StudentList } from '@mis/modules/students';

<StudentList />
```

#### 2. StudentForm

**File**: `StudentForm.tsx`

5-step wizard form for creating or editing student records.

**Steps**:
1. Personal Information (name, father's name, DOB, gender)
2. Contact Information (address, city, province, phone, email)
3. Academic Information (class, section, roll number, education level)
4. Guardian Information (primary & secondary guardians)
5. Additional Information (health, previous school, emergency contact)

**Features**:
- Step-by-step validation
- Progress indicator
- Save draft functionality
- Photo upload
- Zod schema validation
- Guardian nested creation

**Usage**:
```tsx
import { StudentForm } from '@mis/modules/students';

// Create mode
<StudentForm mode="create" onSuccess={() => navigate('/students')} />

// Edit mode
<StudentForm
  mode="edit"
  studentId={123}
  onSuccess={() => navigate('/students')}
/>
```

#### 3. StudentProfile

**File**: `StudentProfile.tsx`

Comprehensive student profile with 8 tabs.

**Tabs**:
1. **Personal**: Basic information, photo
2. **Academic**: Class, section, admission details
3. **Grades**: Integration with Grades module
4. **Assignments**: Student assignments
5. **History**: Audit trail of changes
6. **Guardian**: Guardian details with contact info
7. **Health**: Medical conditions, allergies, medications
8. **Documents**: Document manager component

**Features**:
- Edit button (redirects to StudentForm)
- Status badge
- Quick actions
- Print profile
- Document upload/download

**Usage**:
```tsx
import { StudentProfile } from '@mis/modules/students';

<StudentProfile studentId={123} />
```

#### 4. StudentDashboard

**File**: `StudentDashboard.tsx`

Student portal dashboard showing integrated data from all modules.

**Features**:
- Quick stats cards (Attendance, Grades, Fees, Library)
- Pending actions alerts (overdue fees, books, low attendance)
- Tabbed interface (Overview, Attendance, Grades, Fees, Library)
- Report card download
- Fee receipt generation
- Real-time data from all modules

**Usage**:
```tsx
import { StudentDashboard } from '@mis/modules/students';

<StudentDashboard studentId={123} />
```

### Sub-Components

#### 5. BulkImportModal

**File**: `components/BulkImportModal.tsx`

Modal for bulk CSV import of students.

**Features**:
- CSV file upload with validation
- Template download with example data
- Row-by-row error handling
- Import results display (success count, error count)
- Detailed error reporting with row numbers

**CSV Format**:
```csv
first_name,last_name,father_name,date_of_birth,gender,address,city,province,admission_date,education_level,guardian_first_name,guardian_last_name,guardian_phone,guardian_relation
Ahmad,Ahmadi,Mohammad,2010-05-15,male,Karte 4,Kabul,kabul,2024-01-10,upper_secondary,Mohammad,Ahmadi,0701234567,father
```

**Usage**:
```tsx
import { BulkImportModal } from '@mis/modules/students';

<BulkImportModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
/>
```

#### 6. DocumentManager

**File**: `components/DocumentManager.tsx`

Component for managing student documents.

**Supported Document Types**:
1. Birth Certificate
2. Tazkira (National ID)
3. Transfer Certificate
4. Previous School Results
5. Student Photo
6. Medical Report
7. Guardian Tazkira
8. Vaccination Record
9. Other Documents

**Features**:
- Grid view of documents
- Upload modal with type selection
- File validation (max 10MB)
- View, download, delete actions
- Metadata display (uploader, date)

**Usage**:
```tsx
import { DocumentManager } from '@mis/modules/students';

<DocumentManager studentId={123} />
```

---

## Hooks

### Main Student Hooks

Located in `../../hooks/useStudents.ts`

#### Query Hooks

```typescript
// Get all students with filters
const { data, isLoading } = useStudents({
  class_id: 5,
  section: 'A',
  status: 'active',
  search: 'Ahmad',
  page: 1,
  page_size: 20,
});

// Get single student
const { data: student } = useStudent(studentId);

// Get student documents
const { data: documents } = useStudentDocuments(studentId);

// Get student statistics
const { data: stats } = useStudentStats();
```

#### Mutation Hooks

```typescript
// Create student
const createStudent = useCreateStudent();
createStudent.mutate(studentData, {
  onSuccess: (newStudent) => {
    console.log('Created:', newStudent.student_id);
  },
});

// Update student
const updateStudent = useUpdateStudent();
updateStudent.mutate({ id: 123, data: updateData });

// Delete student
const deleteStudent = useDeleteStudent();
deleteStudent.mutate(123);

// Bulk import
const bulkImport = useBulkImportStudents();
bulkImport.mutate(csvFile);

// Upload document
const uploadDoc = useUploadStudentDocument();
uploadDoc.mutate({
  studentId: 123,
  data: {
    document_type: 'birth_certificate',
    title: 'Birth Certificate',
    file: selectedFile,
  },
});

// Delete document
const deleteDoc = useDeleteStudentDocument();
deleteDoc.mutate({ studentId: 123, documentId: 456 });
```

### Integration Hooks

Located in `hooks/useStudentIntegration.ts`

#### Attendance

```typescript
// Get attendance records
const { data } = useStudentAttendance(studentId, {
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  status: 'present',
});

// Get attendance summary
const { data: summary } = useStudentAttendanceSummary(
  studentId,
  '2024-2025' // academic year
);

// Mark attendance
const markAttendance = useMarkAttendance();
markAttendance.mutate({
  studentId: 123,
  data: {
    date: '2024-01-15',
    status: 'present',
    remarks: 'On time',
  },
});
```

#### Grades

```typescript
// Get grades
const { data: grades } = useStudentGrades(studentId, {
  academic_year: '2024-2025',
  subject_id: 5,
  assessment_type: 'final',
});

// Get grade summary
const { data: summary } = useStudentGradeSummary(studentId, '2024-2025');

// Download report card
const downloadReport = useStudentReportCard();
downloadReport.mutate({
  studentId: 123,
  academicYear: '2024-2025',
  term: 'midterm',
});
```

#### Fees

```typescript
// Get fee records
const { data: fees } = useStudentFees(studentId, {
  academic_year: '2024-2025',
  status: 'pending',
  fee_type: 'tuition',
});

// Get fee summary
const { data: summary } = useStudentFeeSummary(studentId, '2024-2025');

// Record payment
const recordPayment = useRecordPayment();
recordPayment.mutate({
  studentId: 123,
  data: {
    fee_record_id: 456,
    amount: 5000,
    payment_method: 'cash',
    remarks: 'January tuition',
  },
});

// Generate receipt
const generateReceipt = useGenerateFeeReceipt();
generateReceipt.mutate({ studentId: 123, paymentId: 789 });
```

#### Library

```typescript
// Get issued books
const { data: books } = useStudentBooks(studentId, {
  status: 'issued',
  academic_year: '2024-2025',
});

// Get library summary
const { data: summary } = useStudentLibrarySummary(studentId, '2024-2025');

// Issue book
const issueBook = useIssueBook();
issueBook.mutate({
  studentId: 123,
  data: {
    book_id: 456,
    due_date: '2024-02-15',
    remarks: 'Science textbook',
  },
});

// Return book
const returnBook = useReturnBook();
returnBook.mutate({
  studentId: 123,
  issueId: 789,
  data: {
    return_date: '2024-02-10',
    condition: 'good',
  },
});
```

#### Integrated Profile

```typescript
// Get integrated profile (all modules in one call)
const { data: profile } = useStudentIntegratedProfile(studentId, '2024-2025');

// Get quick stats for dashboard
const { data: stats } = useStudentQuickStats(studentId);

// Get pending actions
const { data: pending } = useStudentPendingActions(studentId);
// Returns: { overdue_fees, overdue_books, low_attendance, pending_assignments }
```

---

## Services

### Student Service

**File**: `../../services/studentService.ts`

Main API client for student operations.

```typescript
import { studentService } from '@mis/services/studentService';

// Get all students
const students = await studentService.getAll({ class_id: 5 });

// Get single student
const student = await studentService.getById(123);

// Create student
const newStudent = await studentService.create(studentData);

// Update student
const updated = await studentService.update(123, updateData);

// Delete student
await studentService.delete(123);

// Bulk import
const result = await studentService.bulkImport(csvFile);

// Upload document
const doc = await studentService.uploadDocument(123, {
  document_type: 'birth_certificate',
  title: 'Birth Certificate',
  file: selectedFile,
  description: 'Original document',
});

// Delete document
await studentService.deleteDocument(123, 456);

// Get statistics
const stats = await studentService.getStats();
```

### Integration Service

**File**: `services/integrationService.ts`

API client for cross-module integrations.

```typescript
import integrationService from '@mis/modules/students/services/integrationService';

// Attendance
const attendance = await integrationService.attendance.getStudentAttendance(123);
const summary = await integrationService.attendance.getStudentAttendanceSummary(123);

// Grades
const grades = await integrationService.grades.getStudentGrades(123);
const gradeSummary = await integrationService.grades.getStudentGradeSummary(123);

// Fees
const fees = await integrationService.fees.getStudentFees(123);
const feeSummary = await integrationService.fees.getStudentFeeSummary(123);

// Library
const books = await integrationService.library.getStudentBooks(123);
const librarySummary = await integrationService.library.getStudentLibrarySummary(123);

// Integrated
const integrated = await integrationService.integration.getIntegratedProfile(123);
const quickStats = await integrationService.integration.getStudentQuickStats(123);
const pending = await integrationService.integration.getStudentPendingActions(123);
```

---

## Usage Examples

### Example 1: Student List with Filters

```tsx
import { useState } from 'react';
import { StudentList } from '@mis/modules/students';

function StudentsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Students</h1>
      <StudentList />
    </div>
  );
}
```

### Example 2: Create Student with Guardian

```tsx
import { useNavigate } from 'react-router-dom';
import { StudentForm } from '@mis/modules/students';

function CreateStudentPage() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <StudentForm
        mode="create"
        onSuccess={(student) => {
          console.log('Student created:', student.student_id);
          navigate(`/students/${student.id}`);
        }}
        onCancel={() => navigate('/students')}
      />
    </div>
  );
}
```

### Example 3: Student Profile with Tabs

```tsx
import { useParams } from 'react-router-dom';
import { StudentProfile } from '@mis/modules/students';

function StudentProfilePage() {
  const { id } = useParams();

  return (
    <div className="container mx-auto p-6">
      <StudentProfile studentId={Number(id)} />
    </div>
  );
}
```

### Example 4: Bulk Import Students

```tsx
import { useState } from 'react';
import { BulkImportModal, StudentList } from '@mis/modules/students';
import { Button } from '@mis-components/ui';

function StudentsManagement() {
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Students</h1>
        <Button onClick={() => setShowImport(true)}>
          Bulk Import
        </Button>
      </div>

      <StudentList />

      <BulkImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
      />
    </div>
  );
}
```

### Example 5: Student Dashboard with Integrations

```tsx
import { useParams } from 'react-router-dom';
import { StudentDashboard } from '@mis/modules/students';

function StudentPortal() {
  const { studentId } = useParams();

  return (
    <div className="container mx-auto p-6">
      <StudentDashboard studentId={Number(studentId)} />
    </div>
  );
}
```

### Example 6: Export Students

```tsx
import { useStudents } from '@mis/modules/students';
import { exportFilteredStudents, printStudentList } from '@mis/modules/students';
import { Button } from '@mis-components/ui';

function StudentExport() {
  const { data } = useStudents({ class_id: 5, section: 'A' });

  const handleExport = () => {
    if (data?.results) {
      exportFilteredStudents(data.results, { class_id: 5, section: 'A' });
    }
  };

  const handlePrint = () => {
    if (data?.results) {
      printStudentList(data.results);
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleExport}>Export CSV</Button>
      <Button onClick={handlePrint}>Print List</Button>
    </div>
  );
}
```

---

## Integration with Other Modules

The Student Module integrates seamlessly with:

### Attendance Module
- View student attendance records
- Mark attendance from student profile
- Display attendance percentage and alerts

### Grades Module
- View all grades by subject and assessment type
- Download report cards
- Display overall GPA and rank

### Fees Module
- View fee records and payment history
- Record payments
- Generate fee receipts
- Display overdue fees alerts

### Library Module
- View issued books and due dates
- Issue and return books
- Display overdue books and fines

### Classes Module
- Filter students by class and section
- Display class assignment in student profile

### Teachers Module
- View assigned class teacher
- Display subject teachers

---

## Afghan Education System Support

### 34 Provinces

All 34 Afghan provinces are supported with proper Dari/Pashto translations:

```
Kabul, Balkh, Herat, Kandahar, Nangarhar, Kunduz, Baghlan, Takhar,
Badakhshan, Ghazni, Paktia, Paktika, Khost, Logar, Wardak, Kapisa,
Parwan, Panjshir, Bamyan, Daykundi, Ghor, Faryab, Jawzjan, Sar-e-Pol,
Samangan, Helmand, Farah, Nimroz, Uruzgan, Zabul, Kunar, Laghman,
Nuristan, Badghis
```

### Education Levels

```typescript
{
  primary: 'Primary (Grades 1-6)',           // Ages 6-12
  lower_secondary: 'Lower Secondary (7-9)',  // Ages 12-15
  upper_secondary: 'Upper Secondary (10-12)' // Ages 15-18
}
```

### Naming Conventions

Afghan naming conventions are supported:
- **Father's Name**: Required field
- **Grandfather's Name**: Optional field
- **Full Name**: Auto-generated from first + last name

### National ID (Tazkira)

- Student Tazkira field
- Guardian Tazkira field
- Guardian Tazkira document upload

### RTL Language Support

The module supports RTL languages (Dari, Pashto) through i18next:
- RTL layout switching
- Proper text alignment
- Date formatting for Afghan calendar

---

## API Endpoints

### Student Endpoints

```
GET    /api/v1/mis/students/              # List students (with filters)
POST   /api/v1/mis/students/              # Create student
GET    /api/v1/mis/students/{id}/         # Get student details
PUT    /api/v1/mis/students/{id}/         # Update student
PATCH  /api/v1/mis/students/{id}/         # Partial update
DELETE /api/v1/mis/students/{id}/         # Delete student (soft delete)

POST   /api/v1/mis/students/bulk_import/  # Bulk import CSV
GET    /api/v1/mis/students/stats/        # Get statistics

GET    /api/v1/mis/students/{id}/documents/           # List documents
POST   /api/v1/mis/students/{id}/documents/           # Upload document
DELETE /api/v1/mis/students/{id}/documents/{doc_id}/  # Delete document
```

### Integration Endpoints

```
# Attendance
GET /api/v1/mis/attendance/student/{id}/
GET /api/v1/mis/attendance/student/{id}/summary/
POST /api/v1/mis/attendance/student/{id}/mark/

# Grades
GET /api/v1/mis/grades/student/{id}/
GET /api/v1/mis/grades/student/{id}/summary/
GET /api/v1/mis/grades/student/{id}/report-card/{year}/

# Fees
GET /api/v1/mis/fees/student/{id}/
GET /api/v1/mis/fees/student/{id}/summary/
POST /api/v1/mis/fees/student/{id}/payment/
GET /api/v1/mis/fees/student/{id}/receipt/{payment_id}/

# Library
GET /api/v1/mis/library/student/{id}/books/
GET /api/v1/mis/library/student/{id}/summary/
POST /api/v1/mis/library/student/{id}/issue/
POST /api/v1/mis/library/student/{id}/return/{issue_id}/

# Integrated Profile
GET /api/v1/mis/students/{id}/integrated-profile/
```

---

## Best Practices

### 1. Always Use Hooks

✅ **Do**:
```typescript
const { data, isLoading } = useStudents({ class_id: 5 });
```

❌ **Don't**:
```typescript
const students = await studentService.getAll({ class_id: 5 });
```

### 2. Handle Loading States

✅ **Do**:
```typescript
if (isLoading) return <Spinner />;
if (error) return <Alert variant="error">{error.message}</Alert>;
return <StudentList data={data} />;
```

### 3. Use Optimistic Updates

React Query automatically handles cache invalidation, but you can use optimistic updates:

```typescript
const updateStudent = useUpdateStudent();

updateStudent.mutate(
  { id: 123, data: { status: 'inactive' } },
  {
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: studentKeys.detail(123) });
      const previous = queryClient.getQueryData(studentKeys.detail(123));
      queryClient.setQueryData(studentKeys.detail(123), (old) => ({
        ...old,
        ...newData.data,
      }));
      return { previous };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(studentKeys.detail(123), context.previous);
    },
  }
);
```

### 4. Export with Filters

Always use the current filter state when exporting:

```typescript
const handleExport = () => {
  if (data?.results) {
    exportFilteredStudents(data.results, filters);
  }
};
```

---

## Performance Considerations

- **Pagination**: Default page size is 20, configurable up to 100
- **Stale Time**: Queries have staleTime of 5 minutes to reduce refetches
- **Cache Time**: React Query caches inactive queries for 5 minutes
- **Debounced Search**: Search input is debounced by 300ms
- **Lazy Loading**: Documents and integration data load on-demand

---

## Testing

### Unit Tests

```bash
npm test -- students
```

### Integration Tests

```bash
npm run test:integration -- students
```

### E2E Tests

```bash
npm run test:e2e -- students
```

---

## Troubleshooting

### Common Issues

**Issue**: Students not loading
- Check API endpoint is accessible
- Verify authentication token is valid
- Check browser console for errors

**Issue**: Bulk import fails
- Verify CSV format matches template
- Check file encoding (UTF-8 required)
- Ensure all required fields are present

**Issue**: Documents not uploading
- Check file size (max 10MB)
- Verify file type is allowed
- Check backend media storage configuration

---

## Future Enhancements

- [ ] PDF export with custom templates
- [ ] Student ID card generation
- [ ] QR code for student ID
- [ ] SMS notifications to guardians
- [ ] Photo capture from webcam
- [ ] Biometric attendance integration
- [ ] Transfer certificate generation
- [ ] Promotion workflow (year-end)
- [ ] Student conduct records
- [ ] Achievements and awards

---

## Contributors

- Development Team
- QA Team
- Product Management
- UX/UI Design

---

## License

Proprietary - All rights reserved

---

## Support

For support, please contact:
- Email: support@schoolmis.af
- Phone: +93 (0) XX XXX XXXX
- Documentation: https://docs.schoolmis.af

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready ✅
