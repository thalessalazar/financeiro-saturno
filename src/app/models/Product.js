const mongoose = require('../../database/database');
const bcrypt = require('bcryptjs');

const ProductSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    Order: {
        type: mongoose.Types.ObjectId,
        ref: 'Custommer',
        require: true
    },
    createdAt: {
        type: Date,
        dafault: Date.now()
    },
    cost: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }

});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;