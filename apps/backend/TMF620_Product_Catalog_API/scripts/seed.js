/* Seed sample data for TMF620 */
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductSpecification = require('../models/ProductSpecification');
const ProductOffering = require('../models/ProductOffering');
const ProductOfferingPrice = require('../models/ProductOfferingPrice');
const ProductCatalog = require('../models/ProductCatalog');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tmf620_product_catalog';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    ProductSpecification.deleteMany({}),
    ProductOffering.deleteMany({}),
    ProductOfferingPrice.deleteMany({}),
    ProductCatalog.deleteMany({})
  ]);

  const catalog = await ProductCatalog.create({
    id: 'CATALOG-001',
    name: 'Default Product Catalog',
    description: 'Sample catalog for TMF620'
  });

  const mobileCat = await Category.create({ id: 'CAT-MOBILE', name: 'Mobile', isRoot: true, href: '/api/v1/categories/CAT-MOBILE' });
  const broadbandCat = await Category.create({ id: 'CAT-BB', name: 'Broadband', isRoot: true, href: '/api/v1/categories/CAT-BB' });

  const specMobile = await ProductSpecification.create({ id: 'SPEC-MOB-PLAN', name: 'Mobile Plan Spec', productNumber: 'SPC-1001', brand: 'MarketHub' });
  const specBB = await ProductSpecification.create({ id: 'SPEC-BB-PLAN', name: 'Broadband Plan Spec', productNumber: 'SPC-2001', brand: 'MarketHub' });

  const offeringMobile = await ProductOffering.create({ id: 'OFF-MOB-10GB', name: 'Mobile 10GB Plan', isSellable: true, category: [{ id: mobileCat.id, href: mobileCat.href, name: mobileCat.name }], productSpecification: { id: specMobile.id, name: specMobile.name } });
  const offeringBB = await ProductOffering.create({ id: 'OFF-BB-100', name: 'Broadband 100Mbps', isSellable: true, category: [{ id: broadbandCat.id, href: broadbandCat.href, name: broadbandCat.name }], productSpecification: { id: specBB.id, name: specBB.name } });

  // Create ProductOfferingPrice: base price and discount price, then link via popRelationship (discountedBy)
  const popBase = await ProductOfferingPrice.create({
    id: 'POP-MOB-10GB-BASE',
    name: 'Base Monthly Price',
    priceType: 'recurring',
    recurringChargePeriod: 'month',
    price: {
      taxIncludedAmount: { value: 25, unit: 'USD' },
      dutyFreeAmount: { value: 25, unit: 'USD' },
      taxRate: 0
    },
    lifecycleStatus: 'Active',
    validFor: { startDateTime: new Date() }
  });

  const popDiscount = await ProductOfferingPrice.create({
    id: 'POP-MOB-10GB-DISC10',
    name: 'Promo 10% Off 3 months',
    priceType: 'discount',
    priceAlteration: [{
      applicationOrder: 1,
      name: 'Percentage Discount',
      price: { dutyFreeAmount: { value: -2.5, unit: 'USD' }, taxIncludedAmount: { value: -2.5, unit: 'USD' } },
      validFor: { startDateTime: new Date(), endDateTime: new Date(Date.now() + 90*24*3600*1000) }
    }],
    lifecycleStatus: 'Active',
    validFor: { startDateTime: new Date(), endDateTime: new Date(Date.now() + 90*24*3600*1000) }
  });

  // Link: base price discountedBy discount price
  await ProductOfferingPrice.updateOne({ id: popBase.id }, {
    $set: {
      popRelationship: [{
        id: popDiscount.id,
        href: `/tmf-api/productCatalog/v5/productOfferingPrice/${popDiscount.id}`,
        name: popDiscount.name,
        relationshipType: 'discountedBy',
        '@referredType': 'ProductOfferingPrice'
      }]
    }
  });

  // Attach pricing refs to the mobile offering
  await ProductOffering.updateOne({ id: offeringMobile.id }, {
    $set: {
      productOfferingPrice: [
        { id: popBase.id, href: `/tmf-api/productCatalog/v5/productOfferingPrice/${popBase.id}`, name: popBase.name, '@referredType': 'ProductOfferingPrice' },
        { id: popDiscount.id, href: `/tmf-api/productCatalog/v5/productOfferingPrice/${popDiscount.id}`, name: popDiscount.name, '@referredType': 'ProductOfferingPrice' }
      ]
    }
  });

  await Product.create({ id: 'PROD-SIM', name: 'SIM Card', brand: 'MarketHub', category: [{ id: mobileCat.id, href: mobileCat.href, name: mobileCat.name }], productSpecification: { id: specMobile.id, name: specMobile.name } });
  await Product.create({ id: 'PROD-ROUTER', name: 'WiFi Router', brand: 'MarketHub', category: [{ id: broadbandCat.id, href: broadbandCat.href, name: broadbandCat.name }], productSpecification: { id: specBB.id, name: specBB.name } });

  console.log('Seed completed:');
  console.log({ catalog: catalog.id, categories: [mobileCat.id, broadbandCat.id], specs: [specMobile.id, specBB.id], offerings: [offeringMobile.id, offeringBB.id], prices: [popBase.id, popDiscount.id] });
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});


