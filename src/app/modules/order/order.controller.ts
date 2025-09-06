import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { OrderServices } from "./order.service";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user as JwtPayload;

  const result = await OrderServices.createOrder(req.body, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created succesfully",
    data: result,
  });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getAllOrders(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All orders retrieved succesfully",
    data: result,
  });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderServices.getMyOrders(
    req.user.userId,
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My orders retrieved succesfully",
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await OrderServices.getSingleOrder(orderId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order retrieved succesfully",
    data: result,
  });
});

const updateOrder = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await OrderServices.updateOrder(orderId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order updated succesfully",
    data: result,
  });
});

export const OrderControllers = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrder,
};
