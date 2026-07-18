import mongoose, { isValidObjectId } from "mongoose";

import { connectDb } from "../db/mongoose";
import Medicine from "../models/medicine";
import { serializeMedicine } from "../serializers/medicine";
import { UpdateMedicineSchema } from "../validators/medicine";

export async function updateMedicine(
  id: string,
  input: UpdateMedicineSchema
) {
      if (!isValidObjectId(id)) {
        throw new Error("Medicine not found");
           }  

    try {
         
    await connectDb();
    const updatedMedicine = await Medicine.findByIdAndUpdate(id, input, { new: true });
    if (!updatedMedicine) {
        throw new Error("Medicine not found");
    }
    return serializeMedicine(updatedMedicine);
    } catch (error) {
        if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
            throw new Error("Medicine already exists");
        }
        throw error;

    }

}