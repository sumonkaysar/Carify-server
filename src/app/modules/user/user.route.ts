import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import { UserControllers } from "./user.controller";

const router = Router();

router.patch(
  "/:id",
  checkAuth(),
  //   validateRequest(updateUserZodSchema),
  UserControllers.updateUser
);

router.get(
  "/me",
  checkAuth(),
  UserControllers.getMe
);

export const UserRoutes = router;
