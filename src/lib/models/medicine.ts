import mongoose, { Schema, model, models } from "mongoose";

export interface IMedicine {
  _id: mongoose.Types.ObjectId;
  name: string;
  default_quantity: number;
  created_at: Date;
  updated_at: Date;
}

const MedicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true, trim: true },
    default_quantity: { type: Number, required: true, min: 1 },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

// Case-insensitive unique name (docs: collation strength 2)
MedicineSchema.index(
  { name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } },
);

const Medicine =
  models?.Medicine || model<IMedicine>("Medicine", MedicineSchema);

export default Medicine;
