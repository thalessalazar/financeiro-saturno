const mongoose = require('../../database/database');

const OrderSchema = new mongoose.Schema({
    custommer: {
        type: mongoose.Types.ObjectId,
        ref: 'Custommer',
        require: true
    },
    createdAt: {
        type: Date,
        dafault: Date.now()
    },
    hasBeenDelivered: {
        type: Boolean,
        require: true,
        dafault: false
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    totalOrder: {
        type: Number,
    },
    month: {
        type: Number,
        required: true
    }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;