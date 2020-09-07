const express = require('express');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

const Custommer = require('../models/Custommer');
const Order = require('../models/Order');
const Product = require('../models/Product');

router.use(authMiddleware);

//List Order
router.get('/', async (req, res, next) => {
    try {
        const order = await Order.find().populate('products');
        return res.status(200).send({ order });
    } catch (err) {
        return res.status(400).send({ err: err });
    }
});

//list Projects Details
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(400).send({ err: 'Order not found' });
        }

        return res.status(200).send({ order: order });
    } catch (err) {
        return res.status(401).send({ err: err });
    }
});

//create project
router.post('/', async (req, res, next) => {
    //Com inclu~sao 1 para n
    try {
        const { custommer, hasBeenDelivered, products, totalOrder, month } = req.body;

        const order = await Order.create({
            custommer,
            hasBeenDelivered,
            totalOrder,
            month
        });

        await Promise.all(products.map(async product => {
            const orderProduct = new Product({ ...product, order: order._id });
            await orderProduct.save();
            order.products.push(orderProduct);
        }));

        await order.save();

        return res.status(200).send({ order });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ err: err });
    }

});

router.put('/update/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const { custommer, hasBeenDelivered, products, totalOrder, month } = req.body;

        const order = await Order.findByIdAndUpdate(id, {
            custommer,
            hasBeenDelivered,
            products,
            totalOrder,
            month
        }, { new: true });

        order.products = [];
        await Order.remove({ order: order._id });

        await Promise.all(products.map(async product => {
            const orderProduct = new Task({ ...product, order: order._id });
            await orderProduct.save();
            order.products.push(orderProduct);
        }));

        await project.save();

        return res.status(200).send({ project })

    } catch (err) {
        console.log(err);
        return res.status(400).send({ err: err });
    }
});

//delete project
router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await Order.findByIdAndRemove(id);
        return res.status(200).send({ msg: "Order delected" });
    } catch (err) {
        return res.status(400).send({ err: "Error on delete order" });
    }
});

router.delete('/product/:id', (req, res, next) => {
    try {
        const id = req.params.id;
        await Product.findByIdAndRemove(id);
        return res.status(200).send({ msg: "Product Removed" });
    } catch (err) {
        return res.status(200).send({ err: err });
    }
});

module.exports = app => app.use('/order', router);