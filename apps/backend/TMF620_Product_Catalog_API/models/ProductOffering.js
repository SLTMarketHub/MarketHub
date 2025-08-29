const mongoose = require('mongoose');

const ProductOfferingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  '@type': { type: String, required: true },
  href: String,
  lifecycleStatus: { type: String, required: true },
  lastUpdate: { type: Date, required: true },

  agreement: [
    {
      '@referredType': String,
      '@type': String,
      href: String,
      id: String
    }
  ],

  allowedAction: [
    {
      '@type': String,
      channel: {
        '@referredType': String,
        '@type': String,
        href: String,
        id: String
      }
    }
  ],

  attachment: [
    {
      '@referredType': String,
      '@type': String,
      attachmentType: String,
      href: String,
      id: String,
      mimeType: String,
      size: {
        amount: Number,
        units: String
      }
    }
  ],

  bundledGroupProductOffering: [
    {
      '@type': String,
      bundledGroupProductOfferingOption: {
        '@type': String,
        numberRelOfferLowerLimit: Number,
        numberRelOfferUpperLimit: Number
      },
      bundledProductOffering: [
        {
          '@referredType': String,
          '@type': String,
          bundledProductOfferingOption: {
            '@type': String,
            numberRelOfferDefault: Number,
            numberRelOfferLowerLimit: Number,
            numberRelOfferUpperLimit: Number
          },
          href: String,
          id: String,
          name: String
        }
      ],
      name: String
    }
  ],

  bundledProductOffering: [
    {
      '@referredType': String,
      '@type': String,
      bundledProductOfferingOption: {
        '@type': String,
        numberRelOfferDefault: Number,
        numberRelOfferLowerLimit: Number,
        numberRelOfferUpperLimit: Number
      },
      href: String,
      id: String,
      name: String
    }
  ],

  category: [
    {
      '@referredType': String,
      '@type': String,
      href: String,
      id: String,
      name: String
    }
  ],

  channel: [
    {
      '@referredType': String,
      '@type': String,
      href: String,
      id: String
    }
  ],

  marketSegment: [
    {
      '@referredType': String,
      '@type': String,
      href: String,
      id: String
    }
  ],

  place: [
    {
      '@referredType': String,
      '@type': String,
      href: String,
      id: String
    }
  ],

  policy: [
    {
      '@referredType': String,
      '@type': String,
      href: String,
      id: String
    }
  ],

  productOfferingPrice: [
    {
      '@referredType': String,
      '@type': String,
      href: String,
      id: String,
      name: String,
      price: {
        unit: String,
        value: Number
      }
    }
  ],

  productOfferingTerm: [
    {
      '@type': String,
      duration: {
        amount: Number,
        units: String
      }
    }
  ],

  productSpecification: {
    '@referredType': String,
    '@type': String,
    href: String,
    id: String,
    name: String,
    targetProductSchema: {
      '@schemaLocation': String,
      '@type': String
    }
  },

  serviceLevelAgreement: {
  '@referredType': String,
  '@type': String,
  href: String,
  id: String
},


  serviceCandidate: 
    {
      '@referredType': String,
      '@type': String,
      href: String,
      id: String
    }
  ,

  resourceCandidate: 
    {
      '@referredType': String,
      '@type': String,
      href: String,
      id: String
    }
  
});

module.exports = mongoose.model('ProductOffering', ProductOfferingSchema);
