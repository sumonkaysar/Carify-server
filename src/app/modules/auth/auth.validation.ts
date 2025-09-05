import z from "zod";
import { USER_ROLE, USER_STATUS } from "../user/user.interface";

export const registerZodSchema = z.object({
  fistName: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "First name is required"
          : "First name must be a string",
    })
    .nonempty("First name can't be blank")
    .min(2, "First name must be at least 2 characters long.")
    .max(20, "First name can't be more than 20 characters."),
  middleName: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Middle name is required"
          : "Middle name must be a string",
    })
    .nonempty("Middle name can't be blank")
    .min(2, "Middle name must be at least 2 characters long.")
    .max(20, "Middle name can't be more than 20 characters.")
    .optional(),
  lastName: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Last name is required"
          : "Last name must be a string",
    })
    .nonempty("Last name can't be blank")
    .min(2, "Last name must be at least 2 characters long.")
    .max(20, "Last name can't be more than 20 characters."),
  email: z.email("Invalid email address.").nonempty("Email is required."),
  phone: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Phone number is required"
          : "Phone number must be a string",
    })
    .nonempty("Phone number can't be blank")
    .regex(
      /^(\+8801[3-9]\d{8}|01[3-9]\d{8})$/,
      "Invalid format for Bangladeshi phone number (+8801xxxxxxxxx or 01xxxxxxxxx)"
    )
    .optional(),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required"
          : "Password must be a string",
    })
    .nonempty("Password can't be blank")
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,

      "Password must include at least 1 uppercase, 1 lowercase, and 1 special character (! @ # $ % ^ & *)"
    ),
  address: z
    .string("Address must be a string")
    .max(200, "Address can't be more than 200 characters.")
    .optional(),
  roles: z
    .array(
      z.enum(
        USER_ROLE,
        `Role must be one of: ${Object.values(USER_ROLE).join(", ")}`
      )
    )
    .optional()
    .default([USER_ROLE.USER]),
  isVerified: z
    .boolean('Is verified must be either "true" or "false"')
    .optional()
    .default(false),
  status: z
    .enum(USER_STATUS, {
      error: `Status must be one of: ${Object.values(USER_STATUS).join(", ")}`,
    })
    .optional()
    .default(USER_STATUS.ACTIVE),
});
