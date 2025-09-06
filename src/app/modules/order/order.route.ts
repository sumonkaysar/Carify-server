import { Router } from "express";
import checkAuth from "../../middlewares/checkAuth";
import validateRequest from "../../middlewares/validateRequest";
import { USER_ROLE } from "../user/user.interface";
import { OrderControllers } from "./order.controller";
import { orderUpdateZodSchema, orderZodSchema } from "./order.validation";

const router = Router();

router.post(
  "/create",
  checkAuth(),
  validateRequest(orderZodSchema),
  OrderControllers.createOrder
);

router.get(
  "/all",
  checkAuth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN),
  OrderControllers.getAllOrders
);

router.get(
  "/my-orders",
  checkAuth(USER_ROLE.USER),
  OrderControllers.getMyOrders
);

router.get("/:OrderId", checkAuth(), OrderControllers.getSingleOrder);

router.patch(
  "/:orderId",
  checkAuth(),
  validateRequest(orderUpdateZodSchema),
  OrderControllers.updateOrder
);

export const OrderRoutes = router;
