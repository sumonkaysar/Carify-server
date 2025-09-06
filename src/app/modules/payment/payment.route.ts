import { Router } from "express";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.get("/init/:bookingId", PaymentControllers.initPayment);
router.post("/success", PaymentControllers.successPayment);
router.post("/cancel", PaymentControllers.cancelPayment);
router.post("/fail", PaymentControllers.failPayment);
router.post("/validate", PaymentControllers.validatePayment);
router.get("/:paymentId/invoice", PaymentControllers.getInvoiceUrl);

export const PaymentRoutes = router;
