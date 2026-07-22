import { connectDb } from "../db/mongoose";
import List from "../models/list";
import { serializeList } from "../serializers/list";

export async function listLists() {
  await connectDb();

  const lists = await List.find().sort({ created_at: -1 });

  return lists.map(serializeList);
}
