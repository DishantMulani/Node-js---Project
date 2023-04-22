import mongoose from "mongoose";
import { ICart } from "../models/ICart";


const CartSchema = new mongoose.Schema<ICart>({
});

const CartCollection = mongoose.model<ICart>("Cart", CartSchema);

export default CartCollection;