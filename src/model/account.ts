import mongoose, { Schema, Document } from "mongoose";

interface IAccount extends Document {
  email: string;
  name: string;
  password: string;
  activated?: boolean;
  key?:string;
  role: string
}

export const accountSchema: Schema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  activated: {type: Boolean, default: false},
  key: {type: String},
  role: {type: String, default: "user"}
});
const AccountModel = mongoose.models.Account
  ? mongoose.model<IAccount>("Account")
  : mongoose.model<IAccount>("Account", accountSchema);

export default AccountModel;
