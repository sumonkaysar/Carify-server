import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.interface";
import { CarControllers } from "./car.controller";
import { brandUpdateZodSchema, brandZodSchema } from "./car.validation";

const router = Router();

router.post(
  "/create-brand",
  checkAuth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(brandZodSchema),
  CarControllers.createBrand
);

router.get("/all-brands", CarControllers.getAllBrands);

router.patch(
  "/edit-brand/:brandId",
  checkAuth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(brandUpdateZodSchema),
  CarControllers.createBrand
);

export const CarRoutes = router;
