// models/User.ts
import mongoose, { Document } from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Email format validation
  password: { type: String, required: true, minlength: 6 }, // Minimum password length
  phone: { type: String, required: true, match: /^[0-9]{10}$/ }, // Ensure phone is exactly 10 digits
  role: { type: String, enum: ['customer', 'admin'], required: true, default: 'customer' },
});

interface IUser extends Document {
  _id: string; // MongoDB ObjectId
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'customer' | 'admin';
}


const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
export type { IUser };