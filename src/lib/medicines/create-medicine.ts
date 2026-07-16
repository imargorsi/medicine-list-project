import mongoose from "mongoose";

import { connectDb } from "../db/mongoose";
import Medicine from "../models/medicine";
import { serializeMedicine } from "../serializers/medicine";
import { CreateMedicineSchema } from "../validators/medicine";

export async function createMedicine(input: CreateMedicineSchema) {
  await connectDb();
  try {
    const medicine = await Medicine.create(input);
    return serializeMedicine(medicine);
  } catch (error) {
    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      throw new Error("Medicine already exists");
    }
    throw error;
  }
}
