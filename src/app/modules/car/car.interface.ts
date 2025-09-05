/* eslint-disable no-unused-vars */
import { Types } from "mongoose";

export enum CAR_STATUS {
  AVAILABLE = "AVAILABLE",
  SOLD = "SOLD",
}

export enum CAR_MILEAGE_UNIT {
  KM = "KM",
  MI = "MI",
}

export enum CAR_CATEGORY {
  SEDAN = "SEDAN",
  HATCHBACK = "HATCHBACK",
  SUV = "SUV",
  CROSSOVER = "CROSSOVER",
  COUPE = "COUPE",
  CONVERTIBLE = "CONVERTIBLE",
  VAN = "VAN",
  TRUCK = "TRUCK",
  LUXURY = "LUXURY",
}

export enum CAR_ENGINE_TYPE {
  PETROL = "PETROL",
  DIESEL = "DIESEL",
  HYBRID = "HYBRID",
  ELECTRIC = "ELECTRIC",
  PLUG_IN_HYBRID = "PLUG-IN-HYBRID",
  CNG = "CNG",
}

export enum CAR_TRANSMISSION {
  MANUAL = "MANUAL",
  AUTOMATIC = "AUTOMATIC",
  SEMI_AUTOMATIC = "SEMI-AUTOMATIC",
  CVT = "CVT",
}

export interface IBrand {
  name: string;
  logo: string;
}

export interface ICar {
  title: string;
  description: string;
  price: number;
  status: CAR_STATUS;
  brand: Types.ObjectId;
  model: string;
  variant?: string;
  year: number;
  VIN?: string;
  mileage: number;
  mileageUnit: CAR_MILEAGE_UNIT;
  color: string;
  category: CAR_CATEGORY;
  engineType: CAR_ENGINE_TYPE;
  engineCapacity: number;
  transmission: CAR_TRANSMISSION;
  horsepower?: number;
  features: string[];
  interiorFeatures?: string[];
  exteriorFeatures?: string[];
  safetyFeatures?: string[];
  images: string[];
  video?: string;
  seller: Types.ObjectId;
  //   createdAt?: Date;
}
