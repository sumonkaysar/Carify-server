import z from "zod";
import { ORDER_STATUS } from "./order.interface";

const getEnumErrorMsg = (enumObj: object, fieldName: string) =>
  `${fieldName} must be one of: ${Object.values(enumObj).join(", ")}`;

export const orderZodSchema = z.object({
  user: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? { message: "User ID is required" }
          : { message: "User ID must be a string" },
    })
    .nonempty("User ID can't be blank")
    .regex(/^[0-9a-fA-F]{24}$/, "User ID must be a valid MongoDB ObjectId"),

  car: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? { message: "Car ID is required" }
          : { message: "Car ID must be a string" },
    })
    .nonempty("Car ID can't be blank")
    .regex(/^[0-9a-fA-F]{24}$/, "Car ID must be a valid MongoDB ObjectId"),

  payment: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? { message: "Payment ID is required" }
          : { message: "Payment ID must be a string" },
    })
    .nonempty("Payment ID can't be blank")
    .regex(/^[0-9a-fA-F]{24}$/, "Payment ID must be a valid MongoDB ObjectId"),
});

export const orderUpdateZodSchema = orderZodSchema.partial().extend({
  status: z
    .enum(Object.values(ORDER_STATUS) as [string, ...string[]], {
      error: () => ({ message: getEnumErrorMsg(ORDER_STATUS, "Status") }),
    })
    .optional(),
});
