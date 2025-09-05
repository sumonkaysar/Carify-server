import { deleteFromCloudinary } from "../../config/cloudinary.config";
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

const updateBrand = async (brandId: string, payload: Partial<IBrand>) => {
  const isDivisionExist = await Brand.findById(brandId);

  if (!isDivisionExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
  }

  if (payload.name) {
    const duplicateDivision = await Brand.findOne({
      name: payload.name,
      _id: brandId,
    });

    if (duplicateDivision) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "A brand with this name already exists"
      );
    }
  }

  const updateDivision = await Brand.findByIdAndUpdate(brandId, payload, {
    new: true,
    runValidators: true,
  });

  if (payload.logo && isDivisionExist.logo) {
    await deleteFromCloudinary(isDivisionExist.logo);
  }

  return updateDivision;
};

// Car Services

export const CarServices = {
  createBrand,
  getAllBrands,
  updateBrand,
};
