let serviceSpecifications = [
  { id: "SS001", name: "Fiber Internet", lifecycleStatus: "Active", isBundle: false }
];

exports.list = (req, res) => {
  res.json(serviceSpecifications);
};

exports.getById = (req, res) => {
  const item = serviceSpecifications.find(s => s.id === req.params.id);
  if (!item) return res.status(404).json({ code: 404, message: 'Not found' });
  res.json(item);
};

exports.create = (req, res) => {
  const newItem = { id: `SS${Date.now()}`, ...req.body };
  serviceSpecifications.push(newItem);
  res.status(201).json(newItem);
};

exports.update = (req, res) => {
  const index = serviceSpecifications.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ code: 404, message: 'Not found' });
  serviceSpecifications[index] = { ...serviceSpecifications[index], ...req.body };
  res.json(serviceSpecifications[index]);
};

exports.remove = (req, res) => {
  serviceSpecifications = serviceSpecifications.filter(s => s.id !== req.params.id);
  res.status(204).send();
};
