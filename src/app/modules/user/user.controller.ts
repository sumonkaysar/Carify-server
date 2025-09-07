import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "../../utils/httpStatus";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { id: userId } = req.params;
  //   const decoded = req.user;
  const result = await UserServices.updateUser(
    userId,
    req.body
    // decoded as JwtPayload
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User updated succesfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getMe(req.user.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User retrieved succesfully",
    data: result,
  });
});

export const UserControllers = {
  updateUser,
  getMe,
};
