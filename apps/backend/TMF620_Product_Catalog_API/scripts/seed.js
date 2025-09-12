/* Seed sample data for TMF620 */
const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductSpecification = require('../models/ProductSpecification');
const ProductOffering = require('../models/ProductOffering');
const ProductCatalog = require('../models/ProductCatalog');

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tmf620_product_catalog';
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    ProductSpecification.deleteMany({}),
    ProductOffering.deleteMany({}),
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

  await Product.create({ id: 'PROD-SIM', name: 'SIM Card', brand: 'MarketHub', category: [{ id: mobileCat.id, href: mobileCat.href, name: mobileCat.name }], productSpecification: { id: specMobile.id, name: specMobile.name } });
  await Product.create({ id: 'PROD-ROUTER', name: 'WiFi Router', brand: 'MarketHub', category: [{ id: broadbandCat.id, href: broadbandCat.href, name: broadbandCat.name }], productSpecification: { id: specBB.id, name: specBB.name } });

  console.log('Seed completed:');
  console.log({ catalog: catalog.id, categories: [mobileCat.id, broadbandCat.id], specs: [specMobile.id, specBB.id], offerings: [offeringMobile.id, offeringBB.id] });
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect();
  process.exit(1);
});


