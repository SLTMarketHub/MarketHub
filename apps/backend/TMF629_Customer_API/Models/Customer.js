const mongoose = require('mongoose');

const TimePeriodSchema = {
    startDateTime: Date,
    endDateTime: Date
};

const ContactMediumSchema = new mongoose.Schema({
    "@type": String,
    contactType: String,
    preferred: Boolean,
    phoneNumber: String,
    emailAddress: String,
    faxNumber: String,
    city: String,
    country: String,
    postCode: String,
    street1: String,
    validFor: TimePeriodSchema
}, { _id: false });

const RelatedPartySchema = new mongoose.Schema({
    "@type": String,
    role: String,
    partyOrPartyRole: {
        "@type": String,
        href: String,
        id: String,
        name: String,
        "@referredType": String
    }
}, { _id: false });

const EngagedPartySchema = {
    "@type": String,
    href: String,
    id: String,
    name: String,
    "@referredType": String
};

const CustomerSchema = new mongoose.Schema({
    "@type": { type: String, default: "Customer", required: true },
    name: { type: String, required: true },
    status: { type: String, default: "Created" },
    statusReason: String,
    validFor: TimePeriodSchema,
    engagedParty: { type: EngagedPartySchema, required: true },
    contactMedium: [ContactMediumSchema],
    relatedParty: [RelatedPartySchema],
    href: String
}, { timestamps: true });


CustomerSchema.pre('save', function (next) {
    if (!this.href) {
        this.href = `https://markethub-api-gateway.onrender.com/tmf-api/customer/v5/customer/${this._id}`;
    }
    next();
});

module.exports = mongoose.model('Customer', CustomerSchema);
