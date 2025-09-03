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
    id: { type: String, unique: true },
    name: { type: String, required: true },
    status: { type: String, default: "Created" },
    statusReason: String,
    validFor: TimePeriodSchema,
    engagedParty: { type: EngagedPartySchema, required: true },
    contactMedium: [ContactMediumSchema],
    relatedParty: [RelatedPartySchema],
    href: String
}, { timestamps: true },{ _id: false });


CustomerSchema.pre('save', async function (next) {
    if (this.id) return next();

    try {
        const lastCustomer = await mongoose.model('Customer')
            .findOne({ id: /^Cust-\d+$/ })
            .sort({ createdAt: -1 })
            .lean();

        let newIdNumber = 1;
        if (lastCustomer && lastCustomer.id) {
            const match = lastCustomer.id.match(/^Cust-(\d+)$/);
            if (match) {
                newIdNumber = parseInt(match[1], 10) + 1;
            }
        }

        this.id = `Cust-${newIdNumber}`;
        this.href = `http://localhost:3000/tmf-api/customerManagement/v5/customer/${this.id}`;
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('Customer', CustomerSchema);