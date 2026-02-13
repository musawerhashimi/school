import { useState } from "react";
import { Download, Edit, Eye, Plus, Search, Trash2, UserPlus, Users } from "lucide-react";
import {
  Button,
  Input,
  Select,
  Textarea,
  Checkbox,
  Radio,
  Switch,
  DatePicker,
  FileUpload,
  Card,
  CardHeader,
  CardContent,
  Modal,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DataTable,
  Badge,
  Avatar,
  ProgressBar,
  Skeleton,
  Alert,
  Spinner,
  Dropdown,
  DropdownButton,
  Pagination,
  Breadcrumb,
  Tooltip,
  type Column,
  type DropdownItem,
} from "../../components/ui";
import { toast } from "react-hot-toast";

export default function UIShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [switchValue, setSwitchValue] = useState(false);

  // Sample data for DataTable
  const columns: Column<any>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "success" : "secondary"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost">
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const data = [
    { id: "1", name: "Ahmad Khan", email: "ahmad@example.com", status: "active" },
    { id: "2", name: "Fatima Ali", email: "fatima@example.com", status: "active" },
    { id: "3", name: "Hassan Zoy", email: "hassan@example.com", status: "inactive" },
  ];

  const dropdownItems: DropdownItem[] = [
    { label: "Edit", value: "edit", icon: <Edit className="h-4 w-4" />, onClick: () => toast.success("Edit clicked") },
    { label: "Delete", value: "delete", icon: <Trash2 className="h-4 w-4" />, onClick: () => toast.error("Delete clicked") },
    { divider: true, label: "", value: "divider1" },
    { label: "Download", value: "download", icon: <Download className="h-4 w-4" />, onClick: () => toast.success("Download clicked") },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-text-primary mb-2">
          UI Component Showcase
        </h1>
        <p className="text-text-secondary">
          Sultan Zoy High School MIS - Complete component library built with Tailwind CSS
        </p>
      </div>

      {/* Breadcrumb */}
      <Card>
        <CardHeader title="Breadcrumb Navigation" />
        <CardContent>
          <Breadcrumb
            items={[
              { label: "Students", href: "/mis/students" },
              { label: "Class 10", href: "/mis/students?class=10" },
              { label: "Ahmad Khan" },
            ]}
          />
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card>
        <CardHeader title="Alerts" />
        <CardContent>
          <div className="space-y-4">
            <Alert variant="success" title="Success!">
              Student record has been updated successfully.
            </Alert>
            <Alert variant="warning" title="Warning">
              This student has less than 75% attendance.
            </Alert>
            <Alert variant="error" title="Error" onClose={() => toast.success("Alert dismissed")}>
              Failed to save student record. Please try again.
            </Alert>
            <Alert variant="info">
              New admission period starts from March 1st, 2025.
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Buttons */}
      <Card>
        <CardHeader title="Buttons" />
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
                Add Student
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />}>
                Delete
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button fullWidth>Full Width</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Inputs */}
      <Card>
        <CardHeader title="Form Components" />
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Student Name"
              placeholder="Enter student name"
              required
            />
            <Select
              label="Class"
              options={[
                { label: "Class 9", value: "9" },
                { label: "Class 10", value: "10" },
                { label: "Class 11", value: "11" },
                { label: "Class 12", value: "12" },
              ]}
              placeholder="Select class"
            />
            <Textarea
              label="Address"
              placeholder="Enter full address"
              rows={3}
            />
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Date of Birth
              </label>
              <DatePicker onChange={(date) => console.log(date)} />
            </div>

            <div className="md:col-span-2 space-y-3">
              <Checkbox
                label="I agree to the terms and conditions"
                id="terms"
              />

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Gender
                </label>
                <div className="flex gap-4">
                  <Radio name="gender" label="Male" value="male" />
                  <Radio name="gender" label="Female" value="female" />
                </div>
              </div>

              <Switch
                label="Active Status"
                description="Enable or disable this student"
                checked={switchValue}
                onChange={(e) => setSwitchValue(e.target.checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader title="File Upload" />
        <CardContent>
          <FileUpload
            label="Upload Documents"
            description="Drag and drop files here or click to browse (Max 5MB)"
            accept="image/*,.pdf"
            multiple
            maxSize={5 * 1024 * 1024}
            onFilesChange={setFiles}
          />
        </CardContent>
      </Card>

      {/* Badges & Avatars */}
      <Card>
        <CardHeader title="Badges & Avatars" />
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="success">Active</Badge>
              <Badge variant="secondary">Inactive</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="danger">Suspended</Badge>
              <Badge variant="info">New</Badge>
            </div>

            <div className="flex flex-wrap gap-4">
              <Avatar name="Ahmad Khan" size="sm" />
              <Avatar name="Fatima Ali" size="md" />
              <Avatar name="Hassan Zoy" size="lg" src="https://i.pravatar.cc/150?img=1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bars */}
      <Card>
        <CardHeader title="Progress Indicators" />
        <CardContent>
          <div className="space-y-4">
            <ProgressBar value={75} label="Attendance: 75%" variant="success" />
            <ProgressBar value={60} label="Course Progress: 60%" variant="primary" />
            <ProgressBar value={45} label="Fees Paid: 45%" variant="warning" />
          </div>
        </CardContent>
      </Card>

      {/* Dropdowns */}
      <Card>
        <CardHeader title="Dropdowns" />
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Dropdown
              trigger={
                <Button variant="outline">
                  Actions
                </Button>
              }
              items={dropdownItems}
            />

            <DropdownButton label="Export" items={dropdownItems} variant="primary" />
          </div>
        </CardContent>
      </Card>

      {/* Tooltips */}
      <Card>
        <CardHeader title="Tooltips" />
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Tooltip content="This is a tooltip on top" position="top">
              <Button>Hover me (Top)</Button>
            </Tooltip>
            <Tooltip content="This is a tooltip on bottom" position="bottom">
              <Button>Hover me (Bottom)</Button>
            </Tooltip>
            <Tooltip content="This is a tooltip on left" position="left">
              <Button>Hover me (Left)</Button>
            </Tooltip>
            <Tooltip content="This is a tooltip on right" position="right">
              <Button>Hover me (Right)</Button>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      {/* Spinners */}
      <Card>
        <CardHeader title="Loading States" />
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-wrap gap-6">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
              <Spinner size="xl" label="Loading..." />
            </div>

            <div className="h-64 border border-border rounded-lg">
              <Spinner size="lg" label="Loading content..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skeleton */}
      <Card>
        <CardHeader title="Skeleton Loaders" />
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <Card>
        <CardHeader title="Pagination" />
        <CardContent>
          <div className="flex flex-col gap-4">
            <Pagination
              currentPage={currentPage}
              totalPages={10}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader title="Tabs" />
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
              <TabsTrigger value="fees">Fees</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <p className="text-text-secondary">
                Student overview information will be displayed here.
              </p>
            </TabsContent>
            <TabsContent value="attendance">
              <p className="text-text-secondary">
                Attendance records will be displayed here.
              </p>
            </TabsContent>
            <TabsContent value="grades">
              <p className="text-text-secondary">
                Grade information will be displayed here.
              </p>
            </TabsContent>
            <TabsContent value="fees">
              <p className="text-text-secondary">
                Fee payment history will be displayed here.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* DataTable */}
      <Card>
        <CardHeader title="Data Table" />
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchable
            searchPlaceholder="Search students..."
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <Card>
        <CardHeader title="Modal Dialog" />
        <CardContent>
          <Button onClick={() => setModalOpen(true)}>Open Modal</Button>

          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Add New Student"
            size="lg"
          >
            <div className="space-y-4">
              <Input label="Student Name" placeholder="Enter student name" />
              <Select
                label="Class"
                options={[
                  { label: "Class 9", value: "9" },
                  { label: "Class 10", value: "10" },
                ]}
              />
              <Textarea label="Address" placeholder="Enter address" rows={3} />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  toast.success("Student added successfully!");
                  setModalOpen(false);
                }}
              >
                Save Student
              </Button>
            </div>
          </Modal>
        </CardContent>
      </Card>
    </div>
  );
}
