/**
 * ParentProfile Page
 * Parent's personal profile with edit functionality
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  Users,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@mis-components/index";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Badge,
  Avatar,
  Input,
  Textarea,
  Spinner,
  Alert,
} from "@mis-components/ui";
import { useParentProfile, useUpdateParentProfile, useChildren } from "../hooks/useParents";
import { RELATION_TYPE_CONFIG, STUDENT_STATUS_CONFIG } from "../constants";
import type { UpdateParentData } from "../types";

// Validation Schema
const profileSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters").max(50),
  last_name: z.string().min(2, "Last name must be at least 2 characters").max(50),
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(20),
  phone_secondary: z.string().max(20).optional().or(z.literal("")),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
  occupation: z.string().max(100).optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ParentProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading: profileLoading, isError } = useParentProfile();
  const { data: children, isLoading: childrenLoading } = useChildren();
  const updateProfile = useUpdateParentProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone: profile?.phone || "",
      phone_secondary: profile?.phone_secondary || "",
      email: profile?.email || "",
      address: profile?.address || "",
      occupation: profile?.occupation || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    const updateData: UpdateParentData = {
      first_name: data.first_name,
      last_name: data.last_name,
      phone: data.phone,
      phone_secondary: data.phone_secondary || undefined,
      email: data.email || undefined,
      address: data.address || undefined,
      occupation: data.occupation || undefined,
    };

    updateProfile.mutate(updateData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleCancelEdit = () => {
    reset({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone: profile?.phone || "",
      phone_secondary: profile?.phone_secondary || "",
      email: profile?.email || "",
      address: profile?.address || "",
      occupation: profile?.occupation || "",
    });
    setIsEditing(false);
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" label="Loading profile..." />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="p-6">
        <Alert variant="error" title="Error Loading Profile">
          Failed to load your profile. Please try again later.
        </Alert>
        <Button
          variant="outline"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/mis/parents/dashboard")}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const relationConfig = RELATION_TYPE_CONFIG[profile.relation_type] || RELATION_TYPE_CONFIG.guardian;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="My Profile"
        subtitle="Manage your personal information"
        actions={[
          {
            label: "Back to Dashboard",
            icon: <ArrowLeft className="h-4 w-4" />,
            onClick: () => navigate("/mis/parents/dashboard"),
            variant: "ghost",
          },
          ...(isEditing
            ? [
                {
                  label: "Cancel",
                  icon: <X className="h-4 w-4" />,
                  onClick: handleCancelEdit,
                  variant: "outline" as const,
                },
                {
                  label: "Save Changes",
                  icon: <Save className="h-4 w-4" />,
                  onClick: handleSubmit(onSubmit),
                  variant: "primary" as const,
                },
              ]
            : [
                {
                  label: "Edit Profile",
                  icon: <Edit className="h-4 w-4" />,
                  onClick: () => setIsEditing(true),
                  variant: "primary" as const,
                },
              ]),
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:row-span-2">
          <CardContent className="p-6">
            <div className="text-center">
              <Avatar
                name={profile.full_name}
                src={profile.photo_url}
                size="xl"
                className="mx-auto mb-4 ring-4 ring-primary/10"
              />
              <h2 className="text-2xl font-bold text-text-primary">{profile.full_name}</h2>
              <Badge variant="primary" className="mt-2">
                {profile.relation_type_display || relationConfig.label}
              </Badge>

              <div className="mt-6 space-y-4 text-left">
                <div className="flex items-center gap-3 p-3 bg-bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-info" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-secondary">Email</p>
                    <p className="text-sm font-medium text-text-primary truncate">
                      {profile.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-bg-secondary/50 rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-success" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-secondary">Phone</p>
                    <p className="text-sm font-medium text-text-primary">
                      {profile.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                {profile.phone_secondary && (
                  <div className="flex items-center gap-3 p-3 bg-bg-secondary/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-success" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-secondary">Secondary Phone</p>
                      <p className="text-sm font-medium text-text-primary">
                        {profile.phone_secondary}
                      </p>
                    </div>
                  </div>
                )}

                {profile.occupation && (
                  <div className="flex items-center gap-3 p-3 bg-bg-secondary/50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-warning" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-text-secondary">Occupation</p>
                      <p className="text-sm font-medium text-text-primary">{profile.occupation}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Form */}
        <Card className="lg:col-span-2">
          <CardHeader title="Personal Information" />
          <CardContent className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    {...register("first_name")}
                    error={errors.first_name?.message}
                    leftIcon={<User className="h-4 w-4" />}
                  />
                  <Input
                    label="Last Name"
                    {...register("last_name")}
                    error={errors.last_name?.message}
                    leftIcon={<User className="h-4 w-4" />}
                  />
                  <Input
                    label="Phone Number"
                    {...register("phone")}
                    error={errors.phone?.message}
                    leftIcon={<Phone className="h-4 w-4" />}
                  />
                  <Input
                    label="Secondary Phone"
                    {...register("phone_secondary")}
                    error={errors.phone_secondary?.message}
                    leftIcon={<Phone className="h-4 w-4" />}
                  />
                  <Input
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={errors.email?.message}
                    leftIcon={<Mail className="h-4 w-4" />}
                  />
                  <Input
                    label="Occupation"
                    {...register("occupation")}
                    error={errors.occupation?.message}
                    leftIcon={<Briefcase className="h-4 w-4" />}
                  />
                </div>
                <Textarea
                  label="Address"
                  {...register("address")}
                  error={errors.address?.message}
                  rows={3}
                />
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-text-secondary">First Name</label>
                  <p className="mt-1 text-base text-text-primary font-medium">
                    {profile.first_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Last Name</label>
                  <p className="mt-1 text-base text-text-primary font-medium">
                    {profile.last_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                  <p className="mt-1 text-base text-text-primary">{profile.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Secondary Phone</label>
                  <p className="mt-1 text-base text-text-primary">
                    {profile.phone_secondary || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Email</label>
                  <p className="mt-1 text-base text-text-primary">
                    {profile.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-secondary">Occupation</label>
                  <p className="mt-1 text-base text-text-primary">
                    {profile.occupation || "Not provided"}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-text-secondary">Address</label>
                  <p className="mt-1 text-base text-text-primary">
                    {profile.address || "Not provided"}
                  </p>
                </div>
                {profile.national_id && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-text-secondary">National ID</label>
                    <p className="mt-1 text-base text-text-primary font-mono">{profile.national_id}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Children Section */}
        <Card className="lg:col-span-2">
          <CardHeader title="My Children" />
          <CardContent className="p-0">
            {childrenLoading ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="md" />
              </div>
            ) : children && children.length > 0 ? (
              <div className="divide-y divide-border">
                {children.map((child) => {
                  const statusConfig = STUDENT_STATUS_CONFIG[child.status];
                  return (
                    <div
                      key={child.id}
                      className="flex items-center justify-between p-4 hover:bg-bg-secondary/50 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/mis/parents/children/${child.id}`)}
                    >
                      <div className="flex items-center gap-4">
                        <Avatar name={child.full_name} src={child.photo_url} size="md" />
                        <div>
                          <h4 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                            {child.full_name}
                          </h4>
                          <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <GraduationCap className="h-3.5 w-3.5" />
                            <span>{child.class_name}</span>
                            {child.section && <span>• Section {child.section}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                        <ChevronRight className="h-5 w-5 text-text-secondary group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <Users className="h-8 w-8 text-text-secondary mx-auto mb-2" />
                <p className="text-text-secondary">No children linked to your account</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader title="Account Information" />
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-text-secondary">Account Created</label>
              <p className="mt-1 text-base text-text-primary">
                {profile.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Last Updated</label>
              <p className="mt-1 text-base text-text-primary">
                {profile.updated_at
                  ? new Date(profile.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-text-secondary">Relation Type</label>
              <p className="mt-1">
                <Badge variant="primary">{profile.relation_type_display || relationConfig.label}</Badge>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
