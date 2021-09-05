const express = require('express');
const bcrypt = require('bcrypt');
const routes = express.Router();
const User = require('../models/user_model');
const Joi = require('joi');
const verifyToken = require('../middlewares/auth');

/* Joi validation */

const schema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(50)
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
});

/* End Joi */

routes.get('/', verifyToken, (req, res) => {
    let result = listActiveUsers();

    result
        .then(users => {
            return res.json(users);
        })
        .catch(err => {
            return res.status(400).json({
                error: err
            });
        });
});

routes.post('/', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, user) => {
        if(err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if(user) {
            return res.status(400).json({ message: 'User already exists.' });
        }
    });

    const {error, value} = schema.validate({
        name: body.name,
        email: body.email
    });

    if(!error) {
        let result = createUser(body);

        result
            .then(user => {
                res.json({
                    name: user.name,
                    email: user.email
                });
            })
            .catch(err => {
                res.status(400).json({ err });
            });
    } else {
        res.status(400).json({
            error
        })
    }
});

routes.put('/:email', verifyToken, (req, res) => {
    
    const {error, value} = schema.validate({
        name: req.body.name
    });

    if(!error) {
        let result = updateUser(req.params.email, req.body);

        result
            .then(user => {
                res.json({
                    name: user.name,
                    email: user.email
                })
            })
            .catch(err => {
                res.status(400).json({
                    err
                })
            });
    } else {
        res.status(400).json({
            error
        })
    }    
});

routes.delete('/:email', verifyToken, (req, res) => {
    let result = deactivateUser(req.params.email);

    result
        .then(user => {
            return res.json({
                name: user.name,
                email: user.email
            })
        })
        .catch(err => {
            res.status(400).json({
                err
            })
        });
});

async function listActiveUsers() {
    let users = await
        User
            .find({ 'status': true })
            .select({ name: 1, email: 1 });

    return users;
}

async function createUser(body) {
    
    let hashedPassword = bcrypt.hashSync(body.password, 10);

    let user = new User({
        email:      body.email,
        name:       body.name,
        password:   hashedPassword
    });

    return await user.save();
}

async function updateUser(email, body) {
    let user = await User.findOneAndUpdate({ 'email': email}, {
        $set: {
            name: body.name,
            password: body.password
        }
    }, {
        new: true
    });

    return user;
}

async function deactivateUser(email) {
    
    let user = await User.findOneAndUpdate({ 'email': email }, {
        $set: {
            status: false
        }
    }, {
        new: true
    });
    
    return user;
}

module.exports = routes;