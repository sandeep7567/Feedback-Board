import { User } from "./User";
const { Schema, models, model, } = require("mongoose");

const feedbackSchema = new Schema({
  title: {type: String, required: true},
  uploads: {type: [String] },
  description: {type: String, required: true},
  userEmail: {type: String, required: true},
  votesCountCached: {type: Number, default: 0},
},
 {timestamps: true,
  toJSON: {virtuals:true},
  toObject: {virtuals:true},
});

 feedbackSchema.virtual("user", {
  ref: User,
  localField: "userEmail",
  foreignField: "email",
  justOne: true,
});

export const Feedback = models?.FeedbackModel || model("FeedbackModel", feedbackSchema);