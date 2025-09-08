import { Router } from "express";
import { multerUpload } from "../../config/multer.config";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.interface";
import { CarControllers } from "./car.controller";
import { brandZodSchema, carZodSchema } from "./car.validation";

const router = Router();

// Car Brand Routes
router.post(
  "/create-brand",
  checkAuth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  multerUpload.single("file"),
  validateRequest(brandZodSchema),
  CarControllers.createBrand
);
router.get("/all-brands", CarControllers.getAllBrands);
// router.patch(
//   "/edit-brand/:brandId",
//   checkAuth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
//   multerUpload.single("file"),
//   validateRequest(brandUpdateZodSchema),
//   CarControllers.upda
// );

// Car Routes
router.post(
  "/add",
  checkAuth(USER_ROLE.SELLER),
  multerUpload.array("files"),
  validateRequest(carZodSchema),
  CarControllers.addCar
);
router.get("/all", CarControllers.getAllCars);
// router.patch(
//   "/edit/:carId",
//   checkAuth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
//   multerUpload.single("file"),
//   validateRequest(brandUpdateZodSchema),
//   CarControllers.createBrand
// );

export const CarRoutes = router;
