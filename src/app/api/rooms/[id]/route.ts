import ExerciseModel from "@/model/exercise";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
const connectDB = async () => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGDB as string)
      .then(() => {
        console.log("Connected to the database");
        return resolve(true);
      })
      .catch((err) => {
        console.error(`Database connection failed: ${err}`);
        return reject(false);
      });
  });
};
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const post = await ExerciseModel.find({classNumber: params.id});
  return NextResponse.json(post);
}
