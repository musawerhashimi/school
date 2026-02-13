import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Briefcase,
  Download,
  Printer,
  ArrowLeft,
  DollarSign,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@mis-components/index";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Badge,
  Avatar,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Spinner,
  Alert,
  Modal,
} from "@mis-components/ui";
import {
  useStaffDetail,
  useDeleteStaff,
  useSalaryHistory,
  useStaffShifts,
  useStaffDocuments,
} from "../hooks/useStaff";
import { AssignShiftModal, SetSalaryModal } from "../components";

export default function StaffProfile() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [assignShiftModalOpen, setAssignShiftModalOpen] = useState(false);
  const [setSalaryModalOpen, setSetSalaryModalOpen] = useState(false);
  const staffId = id ? parseInt(id, 10) : 0;

  // React Query hooks
  const { data: staff, isLoading, isError, error } = useStaffDetail(staffId);
  const { data: salaryHistory } = useSalaryHistory(staffId);
  const { data: shifts } = useStaffShifts(staffId);
  const { data: documents } = useStaffDocuments(staffId);
  const deleteStaffMutation = useDeleteStaff();

  const handleDelete = () => {
    deleteStaffMutation.mutate(staffId, {
      onSuccess: () => {
        navigate("/mis/staff");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !staff) {
    return (
      <div className="p-6">
        <Alert variant="danger">
          {error?.message || t("mis.staff.messages.loadError")}
        </Alert>
      </div>
    );
  }

  const getStatusVariant = (
    status: string
  ): "success" | "warning" | "danger" | "secondary" | "info" => {
    if (status === "active") return "success";
    if (status === "inactive" || status === "on_leave") return "warning";
    if (status === "terminated" || status === "suspended") return "danger";
    if (status === "resigned") return "secondary";
    return "secondary";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={staff.full_name}
        subtitle={`${staff.position_display} - ${staff.department_display}`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate("/mis/staff")}
            >
              {t("mis.staff.backToList")}
            </Button>
            <Button
              variant="outline"
              leftIcon={<Printer className="h-4 w-4" />}
              onClick={() => window.print()}
            >
              {t("mis.common.print")}
            </Button>
            <Button
              variant="outline"
              leftIcon={<Edit className="h-4 w-4" />}
              onClick={() => navigate(`/mis/staff/${staffId}/edit`)}
            >
              {t("mis.common.edit")}
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setDeleteModalOpen(true)}
            >
              {t("mis.common.delete")}
            </Button>
          </div>
        }
      />

      {/* Header Card with Basic Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <Avatar
              name={staff.full_name}
              src={staff.photo_url}
              size="xl"
              className="ring-4 ring-surface-secondary"
            />

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-text-primary">
                  {staff.full_name}
                </h2>
                <p className="text-text-secondary">{staff.father_name}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-text-tertiary" />
                  <span className="font-mono font-medium text-primary">
                    {staff.staff_id}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-text-tertiary" />
                  <span>{staff.position_display}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-text-tertiary" />
                  <span>
                    {t("mis.staff.fields.joinDate")}: {staff.join_date}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-text-tertiary" />
                  <span>
                    {staff.age} {t("mis.staff.fields.age")}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant={getStatusVariant(staff.status)}>
                  {staff.status_display}
                </Badge>
                <Badge variant="secondary">
                  {staff.employment_type_display}
                </Badge>
                <Badge variant="info">{staff.gender_display}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="personal">
        <TabsList>
          <TabsTrigger value="personal">
            {t("mis.staff.tabs.personalInfo")}
          </TabsTrigger>
          <TabsTrigger value="employment">
            {t("mis.staff.tabs.employment")}
          </TabsTrigger>
          <TabsTrigger value="salary">
            {t("mis.staff.tabs.salary")}
          </TabsTrigger>
          <TabsTrigger value="shifts">
            {t("mis.staff.tabs.shifts")}
          </TabsTrigger>
          <TabsTrigger value="documents">
            {t("mis.staff.tabs.documents")}
          </TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                {t("mis.staff.profile.personalInformation")}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.firstName")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {staff.first_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.lastName")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {staff.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.fatherName")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {staff.father_name}
                  </p>
                </div>
                {staff.grandfather_name && (
                  <div>
                    <p className="text-sm text-text-tertiary">
                      {t("mis.staff.fields.grandfatherName")}
                    </p>
                    <p className="font-medium text-text-primary">
                      {staff.grandfather_name}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.dateOfBirth")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {staff.date_of_birth} ({staff.age} years)
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.gender")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {staff.gender_display}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.nationality")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {staff.nationality}
                  </p>
                </div>
                {staff.marital_status && (
                  <div>
                    <p className="text-sm text-text-tertiary">
                      {t("mis.staff.fields.maritalStatus")}
                    </p>
                    <p className="font-medium text-text-primary">
                      {staff.marital_status_display}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.tazkiraNumber")}
                  </p>
                  <p className="font-medium text-text-primary font-mono">
                    {staff.tazkira_number}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                {t("mis.staff.profile.contactInformation")}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-text-tertiary">
                      {t("mis.staff.fields.phone")}
                    </p>
                    <p className="font-medium text-text-primary font-mono">
                      {staff.phone}
                    </p>
                  </div>
                </div>
                {staff.phone_secondary && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-text-tertiary">
                        {t("mis.staff.fields.phoneSecondary")}
                      </p>
                      <p className="font-medium text-text-primary font-mono">
                        {staff.phone_secondary}
                      </p>
                    </div>
                  </div>
                )}
                {staff.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-text-tertiary">
                        {t("mis.staff.fields.email")}
                      </p>
                      <p className="font-medium text-text-primary">
                        {staff.email}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-text-tertiary">
                      {t("mis.staff.fields.address")}
                    </p>
                    <p className="font-medium text-text-primary">
                      {staff.address}, {staff.city}, {staff.province_display}
                    </p>
                  </div>
                </div>
              </div>

              {staff.emergency_contact_name && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="font-medium text-text-primary mb-2">
                    {t("mis.staff.profile.emergencyContact")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-text-tertiary">Name</p>
                      <p className="font-medium text-text-primary">
                        {staff.emergency_contact_name}
                      </p>
                    </div>
                    {staff.emergency_contact_phone && (
                      <div>
                        <p className="text-sm text-text-tertiary">Phone</p>
                        <p className="font-medium text-text-primary font-mono">
                          {staff.emergency_contact_phone}
                        </p>
                      </div>
                    )}
                    {staff.emergency_contact_relation && (
                      <div>
                        <p className="text-sm text-text-tertiary">Relation</p>
                        <p className="font-medium text-text-primary">
                          {staff.emergency_contact_relation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employment Tab */}
        <TabsContent value="employment" className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-text-primary">
                {t("mis.staff.profile.employmentInformation")}
              </h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.position")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {staff.position_display}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.department")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {staff.department_display}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.employmentType")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {staff.employment_type_display}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.status")}
                  </p>
                  <Badge variant={getStatusVariant(staff.status)}>
                    {staff.status_display}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.joinDate")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {staff.join_date}
                  </p>
                </div>
                {staff.end_date && (
                  <div>
                    <p className="text-sm text-text-tertiary">
                      {t("mis.staff.fields.endDate")}
                    </p>
                    <p className="font-medium text-text-primary">
                      {staff.end_date}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t("mis.staff.fields.workHoursPerWeek")}
                  </p>
                  <p className="font-medium text-text-primary">
                    {staff.work_hours_per_week} hours
                  </p>
                </div>
              </div>

              {staff.highest_qualification && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="font-medium text-text-primary mb-2">
                    {t("mis.staff.profile.qualifications")}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-text-tertiary">
                        {t("mis.staff.fields.highestQualification")}
                      </p>
                      <p className="font-medium text-text-primary">
                        {staff.highest_qualification}
                      </p>
                    </div>
                    {staff.specialization && (
                      <div>
                        <p className="text-sm text-text-tertiary">
                          {t("mis.staff.fields.specialization")}
                        </p>
                        <p className="font-medium text-text-primary">
                          {staff.specialization}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-text-tertiary">
                        {t("mis.staff.fields.yearsOfExperience")}
                      </p>
                      <p className="font-medium text-text-primary">
                        {staff.years_of_experience} years
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {staff.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="font-medium text-text-primary mb-2">
                    {t("mis.staff.fields.notes")}
                  </h4>
                  <p className="text-text-secondary">{staff.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Tab */}
        <TabsContent value="salary" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                {t("mis.staff.salary.title")}
              </h3>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<DollarSign className="h-4 w-4" />}
                onClick={() => setSetSalaryModalOpen(true)}
              >
                {t("mis.staff.salary.setSalary")}
              </Button>
            </CardHeader>
            <CardContent>
              {staff.current_salary_detail ? (
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-text-tertiary mb-1">
                      {t("mis.staff.salary.currentSalary")}
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      AFN {staff.current_salary_detail.total_salary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-text-tertiary">
                        {t("mis.staff.salary.basicSalary")}
                      </p>
                      <p className="font-medium text-text-primary">
                        AFN {staff.current_salary_detail.basic_salary}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-tertiary">
                        {t("mis.staff.salary.housingAllowance")}
                      </p>
                      <p className="font-medium text-text-primary">
                        AFN {staff.current_salary_detail.housing_allowance}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-text-tertiary">
                        {t("mis.staff.salary.transportAllowance")}
                      </p>
                      <p className="font-medium text-text-primary">
                        AFN {staff.current_salary_detail.transport_allowance}
                      </p>
                    </div>
                  </div>

                  {salaryHistory && salaryHistory.length > 1 && (
                    <div className="mt-6 pt-6 border-t border-border">
                      <h4 className="font-medium text-text-primary mb-4">
                        {t("mis.staff.salary.salaryHistory")}
                      </h4>
                      <div className="space-y-2">
                        {salaryHistory.map((salary) => (
                          <div
                            key={salary.id}
                            className="flex justify-between items-center p-3 bg-surface-secondary rounded"
                          >
                            <div>
                              <p className="font-medium text-text-primary">
                                AFN {salary.total_salary}
                              </p>
                              <p className="text-xs text-text-tertiary">
                                {salary.effective_from}
                                {salary.effective_to && ` - ${salary.effective_to}`}
                              </p>
                            </div>
                            {salary.is_current && (
                              <Badge variant="success">Current</Badge>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Alert variant="info">
                  <AlertCircle className="h-4 w-4" />
                  <p>{t("mis.staff.salary.noSalary")}</p>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shifts Tab */}
        <TabsContent value="shifts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                {t("mis.staff.shifts.title")}
              </h3>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Clock className="h-4 w-4" />}
                onClick={() => setAssignShiftModalOpen(true)}
              >
                {t("mis.staff.shifts.assignShift")}
              </Button>
            </CardHeader>
            <CardContent>
              {shifts && shifts.length > 0 ? (
                <div className="space-y-3">
                  {shifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="flex justify-between items-center p-4 bg-surface-secondary rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-text-primary">
                          {shift.shift_name}
                        </p>
                        <p className="text-sm text-text-tertiary">
                          {shift.shift_detail.start_time} -{" "}
                          {shift.shift_detail.end_time}
                        </p>
                        <p className="text-xs text-text-tertiary mt-1">
                          {shift.effective_from}
                          {shift.effective_to && ` - ${shift.effective_to}`}
                        </p>
                      </div>
                      <Badge
                        variant={shift.is_active ? "success" : "secondary"}
                      >
                        {shift.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert variant="info">
                  <AlertCircle className="h-4 w-4" />
                  <p>{t("mis.staff.shifts.noShifts")}</p>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">
                {t("mis.staff.documents.title")}
              </h3>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<FileText className="h-4 w-4" />}
              >
                {t("mis.staff.documents.uploadDocument")}
              </Button>
            </CardHeader>
            <CardContent>
              {documents && documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex justify-between items-center p-3 bg-surface-secondary rounded hover:bg-surface-tertiary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-text-primary">
                            {doc.title}
                          </p>
                          <p className="text-xs text-text-tertiary">
                            {doc.document_type_display} • {doc.created_at}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Download className="h-4 w-4" />}
                        onClick={() => window.open(doc.file_url, "_blank")}
                      >
                        {t("mis.common.download")}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert variant="info">
                  <AlertCircle className="h-4 w-4" />
                  <p>{t("mis.staff.documents.noDocuments")}</p>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={t("mis.staff.actions.deleteStaff")}
      >
        <div className="space-y-4">
          <Alert variant="warning">
            {t("mis.staff.messages.deleteWarning")}
          </Alert>
          <p className="text-text-secondary">
            {t("mis.staff.messages.deleteConfirm")}
          </p>
          <p className="font-medium text-text-primary">
            {staff.full_name} ({staff.staff_id})
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              {t("mis.common.cancel")}
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteStaffMutation.isPending}
            >
              {t("mis.common.delete")}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign Shift Modal */}
      <Modal
        isOpen={assignShiftModalOpen}
        onClose={() => setAssignShiftModalOpen(false)}
        title={t("mis.staff.shifts.assignShift")}
        size="lg"
      >
        <AssignShiftModal
          staffId={staffId}
          onSuccess={() => setAssignShiftModalOpen(false)}
          onCancel={() => setAssignShiftModalOpen(false)}
        />
      </Modal>

      {/* Set Salary Modal */}
      <Modal
        isOpen={setSalaryModalOpen}
        onClose={() => setSetSalaryModalOpen(false)}
        title={t("mis.staff.salary.setSalary")}
        size="lg"
      >
        <SetSalaryModal
          staffId={staffId}
          currentSalary={staff.current_salary_detail}
          onSuccess={() => setSetSalaryModalOpen(false)}
          onCancel={() => setSetSalaryModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
