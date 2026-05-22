import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  role: { type: String, enum: ['servo','admin'], default: 'servo' },
  passwordHash: { type: String, select: false },
  mustChangePassword: { type: Boolean, default: false }
}, { timestamps: true });

export default model('User', UserSchema);
