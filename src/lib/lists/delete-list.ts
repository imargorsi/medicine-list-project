import { isValidObjectId } from "mongoose";

import { connectDb } from "../db/mongoose";
import List from "../models/list";

export async function deleteList(id: string) {
  if (!isValidObjectId(id)) {
    throw new Error("List not found");
  }

  await connectDb();

  const deleted = await List.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error("List not found");
  }
}
