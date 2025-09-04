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

export const UserRoutes = router;
