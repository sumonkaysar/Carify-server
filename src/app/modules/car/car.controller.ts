import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { CarServices } from "./car.service";

// Brand Controllers
const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await CarServices.createBrand(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand created succesfully",
    data: result,
  });
});

const getAllBrands = catchAsync(async (req: Request, res: Response) => {
  const result = await CarServices.getAllBrands(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Brand created succesfully",
    data: result,
  });
});

// Car Controllers

export const CarControllers = {
  createBrand,
  getAllBrands,
};
