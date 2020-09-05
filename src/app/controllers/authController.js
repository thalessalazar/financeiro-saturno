const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const router = express.Router();
const User = require('../models/User');

function generateToken(params = {}) {
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400
    });
}

function generateResetPasswordToken() {
    return crypto.randomBytes(20).toString('hex');
}

router.post('/register', async (req, res, next) => {
    const { email } = req.body;

    try {
        if (await User.findOne({ email })) {
            return res.status(400).send({ error: 'User already exists' });
        }
        
        const user = await User.create(req.body);

        const token = generateToken({ id: user.id });
        user.password = undefined;
        return res.status(200).send({ user, token });

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
});

router.post('/authenticate', async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return res.status(400).send({ error: 'User not found' });
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send({ error: 'Invalid password' });
    }
    user.password = undefined;

    const token = generateToken({ id: user.id });

    res.status(200).send({ user, token });
});

router.post('/forgot_password', async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        const token = generateResetPasswordToken();

        const now = new Date();
        now.setHours(now.getHours() + 1);

        const updates = {
            passwordResetToken: token,
            passwordResetExpires: now
        }

        const result = await User.findOneAndUpdate({ email: email }, updates);

        mailer.sendMail({
            to: email,
            from: 'thalessalazar.12@gmail.com',
            template: 'auth/forgot_password',
            context: {
                token
            }
        }, (err) => {
            if (err) {
                console.log(err);
                return res.status(400).send({ error: 'Cannot send forgot password e-mail' });
            }

            return res.status(200).send({ email: "E-mail enviado" });

        });

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Erro on forgot password, try again' });
    }
});

router.post('/reset_password', async (req, res, next) => {
    const { email, token, password } = req.body;

    try {
        console.log('Entrou no try');
        const user = await User.findOne({ email }).select('+passwordResetToken  +passwordResetExpires');

        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }
        console.log(user.passwordResetToken, user.passwordResetExpires);

        //ta dando problema na hora de salvar o token no banco
        //fica como undefined

        if (token !== user.passwordResetToken) {
            return res.status(400).send({ error: 'Invalid Token' });
        }

        const now = new Date;

        if (now > user.passwordResetExpires) {

            return res.status(400).send({ error: 'Token Expired' });
        }

        let newToken = generateResetPasswordToken();
        user.password = password;
        user.passwordResetToken = newToken;

        await user.save();

        return res.status(200).send({ user });

    } catch (err) {
        console.log(err);
        return res.status(400).send({ error: 'Cannot reset password, try again' });
    }
});

router.post('/details', async (req, res, next) => {
    const id = req.body.id

    try {
        const user = await User.findById(id).select('+passwordResetToken');
        console.log(user);
        return res.status(200).send({ user });
    } catch (err) {
        return res.send(400).send({ err })
    }
});

module.exports = app => app.use('/auth', router);
