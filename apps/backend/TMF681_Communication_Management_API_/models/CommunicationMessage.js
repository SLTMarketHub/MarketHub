import mongoose from "mongoose";


const RelatedPartySchema = new mongoose.Schema({
    id: { type: String },
    href: { type: String },
    name: { type: String },
    role: { type: String },
    "@referredType": { type: String }
}, { _id: false });


const SenderSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    party: RelatedPartySchema
}, { _id: false });


const ReceiverSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    appUserId: { type: String },
    ip: { type: String },
    party: RelatedPartySchema
}, { _id: false });


const CharacteristicSchema = new mongoose.Schema({
    name: { type: String },
    value: mongoose.Schema.Types.Mixed,
    valueType: { type: String }
}, { _id: false });


const AttachmentSchema = new mongoose.Schema({
    id: { type: String },
    href: { type: String },
    url: { type: String },
    name: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    attachmentType: { type: String },
    description: { type: String }
}, { _id: false });


const CommunicationMessageSchema = new mongoose.Schema({
    id: { type: String, index: true },
    href: { type: String },
    subject: { type: String },
    scheduledSendTime: Date,
    state: { type: String, enum: ["initial", "inProgress", "completed", "failed", "cancelled"], default: "initial" },
    description: { type: String },
    content: { type: String, required: true },
    messageType: { type: String, required: true },
    characteristic: [CharacteristicSchema],
    attachment: [AttachmentSchema],
    sender: { type: SenderSchema, required: true },
    receiver: { type: [ReceiverSchema], required: true },
    sendTime: Date,
    sendTimeComplete: Date,
    tryTimes: { type: Number, default: 3 },
    priority: Number,
    logFlag: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});


CommunicationMessageSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    if (!this.id) this.id = this._id.toString();
    if (!this.href) this.href = `/tmf-api/communicationManagement/v4/communicationMessage/${this.id}`;
    next();
});


export default mongoose.model("CommunicationMessage", CommunicationMessageSchema);