import { isValidObjectId } from "mongoose";

import { connectDb } from "../db/mongoose";
import Medicine from "../models/medicine";

export async function deleteMedicine(id: string) {
  if (!isValidObjectId(id)) {
    throw new Error("Medicine not found");
  }
  await connectDb();
  const deletedMedicine = await Medicine.findByIdAndDelete(id);
  if (!deletedMedicine) {
    throw new Error("Medicine not found");
  }
}
