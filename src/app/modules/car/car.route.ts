import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.interface";
import { CarControllers } from "./car.controller";
import { brandZodSchema } from "./car.validation";

const router = Router();

router.post(
  "/brands/create",
  checkAuth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(brandZodSchema),
  CarControllers.createBrand
);

router.post(
  "/brands/create",
  validateRequest(brandZodSchema),
  CarControllers.createBrand
);

export const CarRoutes = router;
