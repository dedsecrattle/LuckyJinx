import { Schema, model, Document } from 'mongoose';

interface IQuestion extends Document {
    questionId: string;
    title: string;
    description: string;
    category: string;
    complexity: 'Easy' | 'Medium' | 'Hard';
    link: string;
}

const questionSchema = new Schema<IQuestion>({
    questionId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    complexity: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
    link: { type: String, required: true }
});

const Question = model<IQuestion>('Question', questionSchema);
export default Question;
