import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAppointment extends Document {
  user_id: Types.ObjectId;
  service_id: Types.ObjectId;
  appointment_date: Date;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: Date;
}

const AppointmentSchema = new Schema<IAppointment>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // ✅ ObjectId
  service_id: { type: Schema.Types.ObjectId, ref: 'Service', required: true }, // ✅ ObjectId
  appointment_date: { type: Date, required: true },
  status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
  created_at: { type: Date, default: Date.now }
});

// ✅ Clear cached model
delete mongoose.models.Appointment;

export default mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema, "Bookings");
