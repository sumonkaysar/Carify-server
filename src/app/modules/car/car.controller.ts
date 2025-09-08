import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { CarServices } from "./car.service";

// Brand Controllers
const createBrand = catchAsync(async (req: Request, res: Response) => {
  const result = await CarServices.createBrand({
    ...req.body,
    logo: req.file?.path,
  });

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
    message: "All brands retrieved succesfully",
    data: result.data,
    meta: result.meta,
  });
});

// Car Controllers
const addCar = catchAsync(async (req: Request, res: Response) => {
  const result = await CarServices.addCar(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Car added succesfully",
    data: result,
  });
});

const getAllCars = catchAsync(async (req: Request, res: Response) => {
  const result = await CarServices.getAllCars(
    req.query as Record<string, string>
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All Cars retrieved succesfully",
    data: result.data,
    meta: result.meta,
  });
});

export const CarControllers = {
  createBrand,
  getAllBrands,
  addCar,
  getAllCars,
};
