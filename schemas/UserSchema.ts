import mongoose from "mongoose";
import { IUser } from "../models/IUser";


const UserSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isAdmin: { type: Boolean, default: true },
    isSuperAdmin: { type: Boolean, default: true }
});

const UserCollection = mongoose.model<IUser>("User", UserSchema);

export default UserCollection;