import { deleteFromCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errorHelpers/AppError";
import FilterData from "../../utils/filterData";
import httpStatus from "../../utils/httpStatus";
import { IBrand, ICar } from "./car.interface";
import { Brand, Car } from "./car.model";

// Brand Services
const createBrand = async (payload: IBrand) => {
  const isBrandExist = await Brand.findOne({ name: payload.name });

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
  const isBrandExist = await Brand.findById(brandId);

  if (!isBrandExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
  }

  if (payload.name) {
    const duplicateBrand = await Brand.findOne({
      name: payload.name,
      _id: { $ne: brandId },
    });

    if (duplicateBrand) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "A brand with this name already exists"
      );
    }
  }

  const brand = await Brand.findByIdAndUpdate(brandId, payload, {
    new: true,
    runValidators: true,
  });

  if (payload.logo && isBrandExist.logo) {
    await deleteFromCloudinary(isBrandExist.logo);
  }

  return brand;
};

// Car Services
const addCar = async (payload: ICar) => {
  const isCarExist = await Car.findOne({ VIN: payload.VIN });

  if (isCarExist) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Car VIN(Vehicle Identification Number) already exists"
    );
  }

  const car = await Car.create(payload);
  return car;
};

const getAllCars = async (query: Record<string, string>) => {
  const cars = FilterData({ DocumentModel: Car, query });
  return cars;
};

const updateCar = async (carId: string, payload: Partial<ICar>) => {
  const isCarExist = await Car.findById(carId);

  if (!isCarExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Car not found");
  }

  if (payload.VIN) {
    const duplicateCar = await Car.findOne({
      VIN: payload.VIN,
      _id: { $ne: carId },
    });

    if (duplicateCar) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "A Car with this name already exists"
      );
    }
  }

  let images: string[] = isCarExist.images || [];

  if (
    payload.deleteImages &&
    payload.deleteImages.length > 0 &&
    isCarExist.images &&
    isCarExist.images.length > 0
  ) {
    images = images.filter(
      (image) => !(payload.deleteImages as string[]).includes(image)
    );
  }

  if (
    payload.images &&
    payload.images.length > 0 &&
    isCarExist.images &&
    isCarExist.images.length > 0
  ) {
    images = [...images, ...payload.images];
  }

  const car = await Car.findByIdAndUpdate(
    carId,
    { ...payload, images },
    {
      new: true,
      runValidators: true,
    }
  );

  if (payload.deleteImages && payload.deleteImages.length > 0) {
    await Promise.all(
      payload.deleteImages.map((image) => deleteFromCloudinary(image))
    );
  }

  return car;
};

export const CarServices = {
  // Brand
  createBrand,
  getAllBrands,
  updateBrand,
  // Car
  addCar,
  getAllCars,
  updateCar,
};
