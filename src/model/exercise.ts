import mongoose, { Schema, Document } from "mongoose";
interface IExercise extends Document {
  title: string;
  classNumber: number;
  url: string;
  activated: boolean,
}

const exerciseSchema: Schema = new Schema({
  title: { type: String, required: true },
  classNumber: { type: Number, required: true },
  url: {type: String, require: true},
  activated: { type: Boolean, default: false },
});

const ExerciseModel = mongoose.models.Exercise
  ? mongoose.model<IExercise>("Exercise")
  : mongoose.model<IExercise>("Exercise", exerciseSchema);

export default ExerciseModel;