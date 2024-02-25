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

export async function GET(request: Request) {
  await connectDB();
  const rooms = await ExerciseModel.find({});
  const uniqueNumbers = new Set(rooms.map((item) => item.classNumber));

  const uniqueData = rooms.filter((item) => {
    if (uniqueNumbers.has(item.classNumber)) {
      uniqueNumbers.delete(item.classNumber);
      return true;
    }
    return false;
  });
  return NextResponse.json(uniqueData.map(item=> item.classNumber));
}
