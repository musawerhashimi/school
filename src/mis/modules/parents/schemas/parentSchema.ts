/**
 * Parent Validation Schemas
 * Zod schemas for parent-related form validation
 */

import { z } from "zod";

// Profile Update Schema
export const parentProfileSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be at most 50 characters"),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be at most 50 characters"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be at most 20 digits"),
  phone_secondary: z
    .string()
    .max(20, "Secondary phone must be at most 20 digits")
    .optional()
    .or(z.literal("")),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  address: z
    .string()
    .max(200, "Address must be at most 200 characters")
    .optional()
    .or(z.literal("")),
  occupation: z
    .string()
    .max(100, "Occupation must be at most 100 characters")
    .optional()
    .or(z.literal("")),
});

export type ParentProfileFormData = z.infer<typeof parentProfileSchema>;

// Relation Type Schema
export const relationTypeSchema = z.enum(["father", "mother", "guardian", "other"]);

export type RelationTypeValue = z.infer<typeof relationTypeSchema>;
