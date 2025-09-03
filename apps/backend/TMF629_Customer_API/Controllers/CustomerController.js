const eventPublisher = require('../Services/EventPublisher');
const customerService = require('../Services/CustomerService');

exports.createCustomer = async (req, res) => {
    try {
        const customer = await customerService.createCustomer(req.body);
        await eventPublisher.publishEvent("CustomerCreateEvent", customer);
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listCustomers = async (req, res) => {
    try {
        const customers = await customerService.listCustomers();
        res.json(customers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const updated = await customerService.updateCustomer(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: "Customer not found" });
        await eventPublisher.publishEvent("CustomerAttributeValueChangeEvent", updated);
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        await customerService.deleteCustomer(req.params.id);
        await eventPublisher.publishEvent("CustomerDeleteEvent", customer);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
