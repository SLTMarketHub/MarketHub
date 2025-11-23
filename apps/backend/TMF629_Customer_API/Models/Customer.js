const mongoose = require("mongoose");

const TimePeriodSchema = {
  startDateTime: Date,
  endDateTime: Date,
};

const AddressSchema = new mongoose.Schema({
  street1: String,
  street2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
}, { _id: false });

const ContactMediumSchema = new mongoose.Schema(
  {
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
    validFor: TimePeriodSchema,
  },
  { _id: false }
);

const RelatedPartySchema = new mongoose.Schema(
  {
    "@type": String,
    role: String,
    partyOrPartyRole: {
      "@type": String,
      href: String,
      id: String,
      name: String,
      "@referredType": String,
    },
  },
  { _id: false }
);

const EngagedPartySchema = {
  "@type": String,
  href: String,
  id: String,
  name: String,
  "@referredType": String,
};

const CustomerSchema = new mongoose.Schema(
  {
      id: {
          type: String,
          unique: true,
          default: function () {
              return `CUS-${this._id}`; // always unique
          }
      },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    "@type": { type: String, default: "Customer", required: true },
    name: { type: String, required: true },
    status: { type: String, default: "Created" },
    statusReason: String,
    validFor: TimePeriodSchema,
    engagedParty: { type: EngagedPartySchema },
    contactMedium: [ContactMediumSchema],
    relatedParty: [RelatedPartySchema],
    address: AddressSchema,
    href: String,
  },
  { timestamps: true }
);

CustomerSchema.pre("save", function (next) {
  if (!this.href) {
    this.href = `https://markethub-api-gateway.onrender.com/tmf-api/customer/v5/customer/${this._id}`;
  }
  next();
});

module.exports = mongoose.model("Customer", CustomerSchema);
