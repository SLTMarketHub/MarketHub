const Customer = require('../Models/Customer');

exports.createCustomer = async (data) => {
    const href = `/customer/${Date.now()}`;
    const newCustomer = new Customer({ ...data, href });
    return await newCustomer.save();
};

exports.getCustomerById = async (id) => {
    return await Customer.findOne({ id: id });
};

exports.listCustomers = async () => {
    return await Customer.find();
};

exports.updateCustomer = async (id, data) => {
    return await Customer.findOneAndUpdate({ id }, data, { new: true });
};


exports.deleteCustomer = async (id) => {
    return await Customer.findOneAndDelete({ id });
};

