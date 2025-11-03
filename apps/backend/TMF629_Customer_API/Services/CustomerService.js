const Customer = require('../Models/Customer');

exports.createCustomer = async (data) => {
    const newCustomer = new Customer(data);
    await newCustomer.save();

    if (!newCustomer.href) {
        newCustomer.href = `https://markethub-api-gateway.onrender.com/tmf-api/customer/v5/customer/${newCustomer._id}`;
        await newCustomer.save();
    }

    return newCustomer;
};

exports.getCustomerById = async (id) => {
    return await Customer.findById(id);
};

exports.listCustomers = async () => {
    return await Customer.find();
};

exports.updateCustomer = async (id, data) => {
    return await Customer.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteCustomer = async (id) => {
    return await Customer.findByIdAndDelete(id);
};

