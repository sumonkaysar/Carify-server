import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { userUpdateSchema } from "./user.validation";

const router = Router();

router.patch(
  "/",
  checkAuth(),
  validateRequest(userUpdateSchema),
  UserControllers.updateUser
);

router.get("/me", checkAuth(), UserControllers.getMe);

export const UserRoutes = router;
