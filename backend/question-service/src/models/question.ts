import { Schema, model, Document } from "mongoose";

interface IQuestion extends Document {
  title: string;
  description: string;
  category: string;
  complexity: "Easy" | "Medium" | "Hard";
}

const questionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  complexity: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
});

const Question = model<IQuestion>("Question", questionSchema);
export default Question;
