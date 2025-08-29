const mongoose = require("mongoose");


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
    validFor: {
        startDateTime: Date,
        endDateTime: Date,
    }
});

const EngagedPartySchema = new mongoose.Schema({
    href: String,
    id: String,
    name: String,
    "@referredType": { type: String, default: "Organization" },
});

const RelatedPartySchema = new mongoose.Schema({
    "@type": String,
    role: String,
    partyOrPartyRole: {
        href: String,
        id: String,
        name: String,
        "@referredType": { type: String, default: "Organization" },
    },
});

const AccountSchema = new mongoose.Schema({
    "@type": String,
    href: String,
    id: String,
    name: String,
    "@referredType": String,
    description: String,
});

const PaymentMethodSchema = new mongoose.Schema({
    "@type": String,
    href: String,
    id: String,
    name: String,
    "@referredType": String,
});

const CreditProfileSchema = new mongoose.Schema({
    "@type": String,
    creditProfileDate: Date,
    creditRiskRating: Number,
    creditScore: Number,
    validFor: {
        startDateTime: Date,
        endDateTime: Date,
    },
});

const AgreementSchema = new mongoose.Schema({
    "@type": String,
    href: String,
    id: String,
    name: String,
});

const CustomerSchema = new mongoose.Schema({
    "@type": { type: String, default: "Customer", required: true },
    href: String,
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    status: { type: String, default:"Created",required: true },
    statusReason: String,
    validFor: {
        startDateTime: Date,
        endDateTime: Date,
    },
    engagedParty: EngagedPartySchema,
    account: [AccountSchema],
    paymentMethod: [PaymentMethodSchema],
    contactMedium: [ContactMediumSchema],
    creditProfile: [CreditProfileSchema],
    agreement: [AgreementSchema],
    relatedParty: [RelatedPartySchema],
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
