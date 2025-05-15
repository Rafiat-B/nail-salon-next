import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
}

const ServiceSchema = new Schema<IService>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  image: { type: String, default: "/images/default-nail.jpg" }, // ✅ Default image
});

export default mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);
