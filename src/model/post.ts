import mongoose, { Schema, Document } from "mongoose";
import { accountSchema } from "./account";

// Định nghĩa schema cho Location thay vì sử dụng type của TypeScript
const locationSchema = new Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  image: { type: String, required: true },
});

// Mở rộng interface IPost để bao gồm các phương thức và thuộc tính của Document
interface IPost extends Document {
  title: string;
  content: string;
  category: string[];
  activated: boolean;
  district: string;
  location: typeof locationSchema; // Sử dụng schema location đã được định nghĩa
  files: string[];
  exercise: string;
}

// Cập nhật schema post
const postSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: [String],
  activated: { type: Boolean, default: false },
  files: [String],
  location: { type: locationSchema, required: true },
  district: { type: String, required: true },
  exercise: { type: String, required: false },
  account: {type: accountSchema}
});

const PostModel = mongoose.models.Post
  ? mongoose.model<IPost>("Post")
  : mongoose.model<IPost>("Post", postSchema);

export default PostModel;
