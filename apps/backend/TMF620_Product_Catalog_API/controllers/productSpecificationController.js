const ProductSpecification = require('../models/ProductSpecification');

// Create
exports.createProductSpecification = async (req, res) => {
  try {
    const body = {
      ...req.body,
      '@type': req.body['@type'] || 'ProductSpecification',
      lastUpdate: req.body.lastUpdate || '2020-09-23T16:42:23.000Z',
      lifecycleStatus: req.body.lifecycleStatus || 'Active'
    };

    if (!body.name) {
      return res.status(400).json({ error: 'name is required' });
    }

    const spec = new ProductSpecification(body);
    await spec.save();

    res.status(201).json({
      id: spec._id.toString(),
      href: `${req.protocol}://${req.get('host')}/api/productSpecification/${spec._id}`,
      '@type': spec['@type'],
      lastUpdate: spec.lastUpdate.toISOString(),
      name: spec.name,
      ...body
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All
exports.getAllProductSpecifications = async (req, res) => {
  try {
    const { fields, filter } = req.query;
    let query = {};

    if (filter && filter.includes('lastUpdate=')) {
      let value = decodeURIComponent(filter.split('lastUpdate=')[1]);
      value = value.replace(/^["']|["']$/g, '').trim();
      const date = new Date(value);
      if (!isNaN(date)) {
        query.lastUpdate = date;
      } else {
        return res.status(400).json({ error: `Invalid date format in filter: ${value}` });
      }
    }

    const specs = await ProductSpecification.find(query);
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const alwaysInclude = ['@type', 'lastUpdate', 'id', 'href', 'name', 'lifecycleStatus'];

    const response = specs.map(spec => {
      const obj = {
        id: spec._id.toString(),
        href: `${baseUrl}/api/productSpecification/${spec._id}`,
        '@type': spec['@type'],
        lastUpdate: spec.lastUpdate?.toISOString(),
        name: spec.name,
        lifecycleStatus: spec.lifecycleStatus || 'Active'
      };

      if (fields) {
        const requestedFields = fields.split(',').map(f => f.trim());
        requestedFields.forEach(field => {
          if (!alwaysInclude.includes(field) && spec[field] !== undefined && typeof spec[field] !== 'function') {
            obj[field] = spec[field];
          }
        });
      }

      return obj;
    });

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get by ID
exports.getProductSpecificationById = async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid or missing ID' });
  }

  try {
    const spec = await ProductSpecification.findById(id);
    if (!spec) {
      return res.status(404).json({ error: 'ProductSpecification not found' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const response = {
      id: spec._id.toString(),
      href: `${baseUrl}/api/productSpecification/${spec._id}`,
      '@type': spec['@type'],
      lastUpdate: spec.lastUpdate?.toISOString(),
      lifecycleStatus: spec.lifecycleStatus || 'Active',
      name: spec.name
    };

    const optionalFields = ['brand', 'description', 'productNumber', 'isBundle'];
    optionalFields.forEach(field => {
      if (spec[field] !== undefined) response[field] = spec[field];
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update
exports.updateProductSpecification = async (req, res) => {
  try {
    const updates = {
      ...req.body,
      '@type': req.body['@type'] || 'ProductSpecification',
      lastUpdate: req.body.lastUpdate || '2020-09-23T16:42:23.000Z',
      lifecycleStatus: req.body.lifecycleStatus || 'Active'
    };

    const spec = await ProductSpecification.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!spec) return res.status(404).json({ error: 'ProductSpecification not found' });

    res.status(200).json({
      id: spec._id.toString(),
      href: `${req.protocol}://${req.get('host')}/api/productSpecification/${spec._id}`,
      '@type': spec['@type'],
      lastUpdate: spec.lastUpdate.toISOString(),
      name: spec.name,
      ...updates
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
exports.deleteProductSpecification = async (req, res) => {
  try {
    const deleted = await ProductSpecification.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'ProductSpecification not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
