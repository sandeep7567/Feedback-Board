import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String },
  email: { type: String },
  image: { type: String },
  emailVerified: Date,
});

export const User = models?.User || model("User", userSchema);