const db = require('../models');

const includes = [db.Pet];

const createCustomer = async (req, res) => {
    try {
        const userId = req.user.id
        const { name, contact, address } = req.body;
        const createdCustomer = await db.Customer.create({
            uid: userId,
            name,
            contact,
            address
        });
        res.status(201).json(createdCustomer).end();
    } catch (err) {
        res.status(500).json(err).end();
    };
};

const getCustomers = async (req, res) => {
    try {
        const userId = req.user.id
        const customers = await db.Customer.findAll({
            where: { uid: userId },
            include: includes
        })
        res.status(200).json(customers).end();
    } catch (err) {
        res.status(500).json(err).end();
    };
};

const getCustomer = async (req, res) => {
    try {
        const targetId = Number(req.params.id);
        const userId = req.user.id;
        const customer = await db.Customer.findOne({
            where: { id: targetId, uid: userId },
            include: includes
        });
        res.status(200).json(customer).end();
    } catch (err) {
        res.status(500).json(err).end();
    };
};

const updateCustomer = async (req, res) => {
    try {
        const targetId = req.params.id;
        const userId = req.user.id;
        const { name, contact, address } = req.body;
        await db.Customer.update({
            name: name,
            contact: contact,
            address: address
        }, {
            where: { id: targetId, uid: userId }
        });
        res.status(200).end();
    } catch (err) {
        res.status(500).json(err).end();
    };
};

const deleteCustomer = async (req, res) => {
    try {
        const targetId = req.params.id;
        const userId = req.user.id
        await db.Customer.destroy({
            where: { id: targetId, uid: userId }
        });
        res.status(200).end()
    } catch (err) {
        res.status(500).json(err).end()
    };
};

module.exports = {
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer
};
