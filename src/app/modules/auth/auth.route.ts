import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { AuthControllers } from "./auth.controller";
import { registerZodSchema } from "./auth.validation";

const router = Router();

router.post(
  "/register",
  validateRequest(registerZodSchema),
  AuthControllers.registerUser
);
router.post("/login", AuthControllers.credentialsLogin);
router.get("/logout", AuthControllers.logout);
router.patch("/reset-password", checkAuth(), AuthControllers.changePassword);

export const AuthRoutes = router;
