import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { registerZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerZodSchema),
  AuthControllers.registerUser
);

export const AuthRoutes = router;
