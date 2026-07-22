import mongoose, { Schema, model, models } from "mongoose";

export interface IListItem {
  _id: mongoose.Types.ObjectId;
  medicine_id: mongoose.Types.ObjectId;
  medicine_name: string;
  quantity: number;
}

export interface IList {
  _id: mongoose.Types.ObjectId;
  list_name: string;
  month: string;
  items: IListItem[];
  created_at: Date;
}

const ListItemSchema = new Schema<IListItem>({
  medicine_id: { type: Schema.Types.ObjectId, required: true },
  medicine_name: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
});

const ListSchema = new Schema<IList>(
  {
    list_name: { type: String, required: true, trim: true },
    month: { type: String, required: true },
    items: { type: [ListItemSchema], required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  },
);

const List = models?.List || model<IList>("List", ListSchema);

export default List;
