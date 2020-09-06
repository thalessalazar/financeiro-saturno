const express = require('express');
const authMiddleware = require('../middlewares/auth');
const router = express.Router();

const Custommer = require('../models/Custommer');

router.use(authMiddleware);

//List Custommer
router.get('/', async (req, res, next) => {
    try {
        const custommerList = await Custommer.find();
        return res.status(200).send({ custommerList });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ err });
    }
});

//list Custommer Details
router.get('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const custommer = await Custommer.findById(id);

        if (!custommer) {
            return res.status(400).send({ err: 'User not found' });
        }

        return res.status(200).send({ custommer });

    } catch (err) {
        return res.status(400).send({ err: 'Not possible' });
    }

});

//create custommer
router.post('/', async (req, res, next) => {
    try {
        const custommer = await Custommer.create(req.body);
        return res.status(200).send({ msg: 'ok', custommer });
    } catch (err) {
        console.log(err);
        return res.status(400).send({ err: err });
    }
});

//Update Custommer
router.put('/update/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const { name, phone } = req.body;

        const custommer = await Custommer.findByIdAndUpdate(id, {
            name,
            phone
        }, { new: true });

        await custommer.save();

        return res.status(200).send({ custommer })

    } catch (err) {
        console.log(err);
        return res.status(400).send({ err: err });
    }
});

//delete custommer
router.delete('/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        await Custommer.findByIdAndRemove(id);
        return res.status(200).send({ msg: "Custommer delected" });
    } catch (err) {
        return res.status(400).send({ err: "Error on delete project" })
    }
});

module.exports = app => app.use('/custommer', router);