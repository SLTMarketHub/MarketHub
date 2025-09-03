import mongoose from "mongoose";


const HubSchema = new mongoose.Schema({
callback: { type: String, required: true },
query: String,
createdAt: { type: Date, default: Date.now }
});


export default mongoose.model("Hub", HubSchema);