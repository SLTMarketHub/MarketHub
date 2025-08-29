const ProductOfferingPrice = require('../models/ProductOfferingPrice');
const { v4: uuidv4 } = require('uuid');

// Helper function to deeply check for nested mandatory fields
function hasNestedField(obj, path) {
  return path.split('.').reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj) !== undefined;
}

// Create ProductOfferingPrice
exports.createProductOfferingPrice = async (req, res) => {
  try {
    // Ensure top-level required fields
    req.body['@type'] = req.body['@type'] || 'ProductOfferingPrice';
    req.body.id = req.body.id || uuidv4();

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    req.body.href = req.body.href || `${baseUrl}/api/productOfferingPrice/${req.body.id}`;

    req.body.lastUpdate = req.body.lastUpdate ? new Date(req.body.lastUpdate) : new Date();
    req.body.lifecycleStatus = req.body.lifecycleStatus || 'Active';

    // Auto-fill missing nested required fields

    // 1. bundledPopRelationship
    if (!Array.isArray(req.body.bundledPopRelationship)) {
      req.body.bundledPopRelationship = [{
        id: uuidv4(),
        href: `${baseUrl}/api/productOfferingPrice/dummy-bundled`,
        '@referredType': 'ProductOfferingPrice',
        '@type': 'ProductOfferingPriceRelationship'
      }];
    }

    // 2. prodSpecCharValueUse
    if (!Array.isArray(req.body.prodSpecCharValueUse)) {
      req.body.prodSpecCharValueUse = [{
        '@type': 'ProdSpecCharValueUse',
        name: 'DefaultCharacteristic',
        valueType: 'string',
        productSpecCharacteristicValue: [{
  '@type': 'ProductSpecCharacteristicValue',
  valueType: 'string'
}],
        productSpecification: {
          '@referredType': 'ProductSpecification',
          '@type': 'ProductSpecificationRef',
          href: `${baseUrl}/api/productSpecification/dummy-spec`,
          id: 'dummy-spec',
          name: 'Dummy Spec',
          targetProductSchema: {
            '@type': 'TargetProductSchema'
          }
        }
      }];
    }

    // Create and save
    const pop = new ProductOfferingPrice(req.body);
    const saved = await pop.save();

    const response = saved.toObject();
    response['@type'] = 'ProductOfferingPrice'; // Ensure response also includes @type

    res.status(201).json(response);
  } catch (err) {
    console.error('Save error:', err);
    res.status(400).json({ error: err.message });
  }
};

// Get all ProductOfferingPrices
exports.getAllProductOfferingPrices = async (req, res) => {
  try {
    const pops = await ProductOfferingPrice.find();
    const response = pops.map(pop => {
      const obj = pop.toObject();
      obj['@type'] = obj['@type'] || 'ProductOfferingPrice';
      return obj;
    });
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
exports.getProductOfferingPriceById = async (req, res) => {
  try {
    const pop = await ProductOfferingPrice.findOne({ id: req.params.id });
    if (!pop) return res.status(404).json({ error: 'Not found' });
    const obj = pop.toObject();
    obj['@type'] = obj['@type'] || 'ProductOfferingPrice';
    res.json(obj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
exports.updateProductOfferingPrice = async (req, res) => {
  try {
    const updated = await ProductOfferingPrice.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Not found' });
    const obj = updated.toObject();
    obj['@type'] = obj['@type'] || 'ProductOfferingPrice';
    res.json(obj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteProductOfferingPrice = async (req, res) => {
  try {
    const deleted = await ProductOfferingPrice.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
