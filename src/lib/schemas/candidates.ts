import { z } from "zod";

const PasswordSchema = z
  .string({ message: "Password is required" })
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const CreateCandidateSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string({ message: "Phone number is required" })
    .min(1, "Phone number is required")
    .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
  firstName: z
    .string({ message: "First name is required" })
    .min(1, "First name is required"),
  lastName: z
    .string({ message: "Last name is required" })
    .min(1, "Last name is required"),
  password: PasswordSchema,
  categoryIds: z
    .array(
      z
        .number()
        .int("Category id must be an integer")
        .positive("Category id must be positive")
    )
    .nonempty("Select at least one category"),
  governorateId: z
    .number({ message: "Governorate is required" })
    .int("Governorate id must be an integer")
    .positive("Governorate id must be positive"),
  bio: z.string().optional(),
  candidatePhone: z
    .string({ message: "Candidate phone is required" })
    .min(1, "Candidate phone is required")
    .regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number"),
  yearsOfExp: z
    .number({ message: "Years of experience is required" })
    .int("Years of experience must be an integer")
    .min(0, "Years of experience cannot be negative")
    .max(50, "Years of experience cannot exceed 50")
    .optional(),
});

export type CreateCandidateFormInput = z.input<typeof CreateCandidateSchema>;
export type CreateCandidateFormData = z.output<typeof CreateCandidateSchema>;

export const UpdateCandidateSchema = CreateCandidateSchema.extend({
  password: PasswordSchema.optional().or(z.literal("")),
});

export type UpdateCandidateFormInput = z.input<typeof UpdateCandidateSchema>;
export type UpdateCandidateFormData = z.output<typeof UpdateCandidateSchema>;
