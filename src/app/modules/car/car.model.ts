import { model, Schema } from "mongoose";
import {
  CAR_CATEGORY,
  CAR_ENGINE_TYPE,
  CAR_MILEAGE_UNIT,
  CAR_STATUS,
  CAR_TRANSMISSION,
  IBrand,
  ICar,
} from "./car.interface";

const BrandSchema = new Schema<IBrand>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Brand = model<IBrand>("Brand", BrandSchema);

const CarSchema = new Schema<ICar>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CAR_STATUS),
      default: CAR_STATUS.AVAILABLE,
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    variant: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    VIN: {
      type: String,
      uppercase: true,
      trim: true,
    },
    mileage: {
      type: Number,
      required: true,
    },
    mileageUnit: {
      type: String,
      enum: Object.values(CAR_MILEAGE_UNIT),
      required: true,
      default: CAR_MILEAGE_UNIT.KM,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(CAR_CATEGORY),
      required: true,
    },
    engineType: {
      type: String,
      enum: Object.values(CAR_ENGINE_TYPE),
      required: true,
    },
    engineCapacity: {
      type: Number,
      required: true,
    },
    transmission: {
      type: String,
      enum: Object.values(CAR_TRANSMISSION),
      required: true,
    },
    horsepower: {
      type: Number,
    },
    features: [
      {
        type: String,
        trim: true,
      },
    ],
    interiorFeatures: [
      {
        type: String,
        trim: true,
      },
    ],
    exteriorFeatures: [
      {
        type: String,
        trim: true,
      },
    ],
    safetyFeatures: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    video: {
      type: String,
      trim: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Car = model<ICar>("Car", CarSchema);
