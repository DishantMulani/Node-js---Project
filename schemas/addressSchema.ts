import mongoose from "mongoose";
import { IAddress } from "../models/IAddress";


const AddressSchema = new mongoose.Schema<IAddress>({
});

const AddressCollection = mongoose.model<IAddress>("Address", AddressSchema);

export default AddressCollection;