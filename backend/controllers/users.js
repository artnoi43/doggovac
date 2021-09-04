const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const getUsers = async (req, res) => {
    try {
        const users = await db.User.findAll()
        res.status(200).json(users).end();
    } catch (err) {
        res.status(500).end();
    };
};

const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const targetUser = await db.User.findOne({
            where: { username: username }
        });

        if (targetUser) {
            res.status(400).send("Username already taken").end();
        } else {
            const salt = bcryptjs.genSaltSync();
            const hashedPassword = bcryptjs.hashSync(password, salt);
            const user = await db.User.create({
                username: username,
                password: hashedPassword
            })
            res.status(201).json(user).end();
        };

    } catch (err) {
        res.status(500).json(err).end();
    };
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const targetUser = await db.User.findOne({
            where: { username: username }
        });
        if (targetUser) {
            const isCorrect = bcryptjs.compareSync(password, targetUser.password);
            if (isCorrect) {
                // Payload for JWT
                const payload = {
                    username: targetUser.username,
                    id: targetUser.id
                }
                // JWT expires in 24 hours
                const token = jwt.sign(payload, process.env.SECRET_OR_KEY, { expiresIn: 3600 * 24 });
                const body = {
                    message: "Login successful",
                    token: token
                };
                res.status(200).json(body).end();
            } else {
                res.status(400).send("Username or Password is Wrong").end();
            };
        } else {
            res.status(400).send("Username or Password is Wrong").end();
        };
    } catch (err) {
        res.status(500).json(err).end();
    };
};

const changePassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const userId = req.user.id;
        const salt = bcryptjs.genSaltSync();
        const hashedNewPassword = bcryptjs.hashSync(newPassword, salt);
        await db.User.update({
            password: hashedNewPassword
        }, {
            where: { id: userId }
        });
        res.status(200).end();
    } catch (err) {
        res.status(500).json(err).end();
    };
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.user.id;
        await db.User.destroy({
            where: { id: userId }
        });
        res.status(200).end();
    } catch (err) {
        res.status(500).end();
    };
};

module.exports = {
    getUsers,
    registerUser,
    loginUser,
    changePassword,
    deleteUser
};
