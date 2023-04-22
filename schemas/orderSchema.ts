import mongoose from "mongoose";
import { IOrder } from "../models/IOrder";


const OrderSchema = new mongoose.Schema<IOrder>({
});

const OrderCollection = mongoose.model<IOrder>("order", OrderSchema);

export default OrderCollection;