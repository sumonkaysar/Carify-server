import AppError from "../../errorHelpers/AppError";
import FilterData from "../../utils/filterData";
import httpStatus from "../../utils/httpStatus";
import { User } from "../user/user.model";
import { IBrand } from "./car.interface";
import { Brand } from "./car.model";

// Brand Services
const createBrand = async (payload: IBrand) => {
  const isBrandExist = await User.findOne({ name: payload.name });

  if (isBrandExist) {
    throw new AppError(httpStatus.CONFLICT, "Brand name already exists");
  }

  const brand = await Brand.create(payload);
  return brand;
};

const getAllBrands = async (query: Record<string, string>) => {
  const brands = FilterData({ DocumentModel: Brand, query });
  return brands;
};

// Car Services

export const CarServices = {
  createBrand,
  getAllBrands,
};
