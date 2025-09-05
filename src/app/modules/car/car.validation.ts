import z from "zod";
import {
  CAR_CATEGORY,
  CAR_ENGINE_TYPE,
  CAR_MILEAGE_UNIT,
  CAR_STATUS,
  CAR_TRANSMISSION,
} from "./car.interface";

const getEnumErrorMsg = (enumObj: object, fieldName: string) =>
  `${fieldName} must be one of: ${Object.values(enumObj).join(", ")}`;

export const brandZodSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Brand is required"
          : "Brand must be a string",
    })
    .nonempty("Brand can't be blank")
    .min(5, "Brand must be at least 5 characters long.")
    .max(50, "Brand can't be more than 50 characters."),
});

export const brandUpdateZodSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Brand is required"
          : "Brand must be a string",
    })
    .nonempty("Brand can't be blank")
    .min(5, "Brand must be at least 5 characters long.")
    .max(50, "Brand can't be more than 50 characters.")
    .optional(),
});

export const carZodSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Title is required"
          : "Title must be a string",
    })
    .nonempty("Title can't be blank")
    .min(5, "Title must be at least 5 characters long.")
    .max(100, "Title can't be more than 100 characters."),

  description: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Description is required"
          : "Description must be a string",
    })
    .nonempty("Description can't be blank")
    .min(10, "Description must be at least 10 characters long.")
    .max(1000, "Description can't be more than 1000 characters."),

  price: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Price is required"
          : "Price must be a number",
    })
    .positive("Price must be a positive number"),

  status: z
    .enum(Object.values(CAR_STATUS), getEnumErrorMsg(CAR_STATUS, "Status"))
    .optional()
    .default(CAR_STATUS.AVAILABLE),

  brand: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Brand ID is required"
          : "Brand ID must be a string",
    })
    .nonempty("Brand ID can't be blank")
    .regex(/^[0-9a-fA-F]{24}$/, "Brand ID must be a valid MongoDB ObjectId"),

  model: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Model is required"
          : "Model must be a string",
    })
    .nonempty("Model can't be blank")
    .min(1, "Model must be at least 1 character long.")
    .max(50, "Model can't be more than 50 characters."),

  variant: z
    .string("Variant must be a string")
    .max(50, "Variant can't be more than 50 characters.")
    .optional(),

  year: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Year is required"
          : "Year must be a number",
    })
    .int("Year must be a whole number"),

  VIN: z
    .string("VIN must be a string")
    .length(17, "VIN must be exactly 17 characters long")
    .regex(
      /^[A-HJ-NPR-Z0-9]{17}$/,
      "VIN must contain only valid alphanumeric characters"
    )
    .optional(),

  mileage: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Mileage is required"
          : "Mileage must be a number",
    })
    .nonnegative("Mileage cannot be negative")
    .max(100, "Mileage for a new car must be less than 100 km"),

  mileageUnit: z
    .enum(Object.values(CAR_MILEAGE_UNIT), {
      error: () => ({
        message: getEnumErrorMsg(CAR_MILEAGE_UNIT, "Mileage unit"),
      }),
    })
    .default(CAR_MILEAGE_UNIT.KM),

  color: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Color is required"
          : "Color must be a string",
    })
    .nonempty("Color can't be blank")
    .min(2, "Color must be at least 2 characters long.")
    .max(30, "Color can't be more than 30 characters."),

  category: z.enum(Object.values(CAR_CATEGORY), {
    error: () => getEnumErrorMsg(CAR_CATEGORY, "Category"),
  }),

  engineType: z.enum(Object.values(CAR_ENGINE_TYPE), {
    error: () => getEnumErrorMsg(CAR_ENGINE_TYPE, "Engin type"),
  }),

  engineCapacity: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Engine capacity is required"
          : "Engine capacity must be a number",
    })
    .positive("Engine capacity must be a positive number")
    .max(10000, "Engine capacity must be less than 10000 cc"),

  transmission: z.enum(Object.values(CAR_TRANSMISSION), {
    error: () => ({
      message: getEnumErrorMsg(CAR_TRANSMISSION, "Transmission"),
    }),
  }),

  horsepower: z
    .number("Horsepower must be a number")
    .positive("Horsepower must be a positive number")
    .max(2000, "Horsepower must be less than 2000")
    .optional(),

  features: z
    .array(z.string("Each feature must be a string"), {
      error: (issue) =>
        issue.input === undefined
          ? "Features are required"
          : "Features must be an array of strings",
    })
    .nonempty("At least one feature is required")
    .max(50, "Cannot have more than 50 features"),

  interiorFeatures: z
    .array(z.string("Each interior feature must be a string"))
    .max(30, "Cannot have more than 30 interior features")
    .optional(),

  exteriorFeatures: z
    .array(z.string("Each exterior feature must be a string"))
    .max(30, "Cannot have more than 30 exterior features")
    .optional(),

  safetyFeatures: z
    .array(z.string("Each safety feature must be a string"))
    .max(30, "Cannot have more than 30 safety features")
    .optional(),

  seller: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Seller ID is required"
          : "Seller ID must be a string",
    })
    .nonempty("Seller ID can't be blank")
    .regex(/^[0-9a-fA-F]{24}$/, "Seller ID must be a valid MongoDB ObjectId"),
});

export const carUpdateZodSchema = carZodSchema.partial();
