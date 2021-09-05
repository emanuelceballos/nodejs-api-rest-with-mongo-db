const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const routes = express.Router();
const User = require('../models/user_model');
const config = require('config');

routes.post('/', (req, res) => {
    
    const loginErrorMessage = 'Incorrect user or password.';

    User
        .findOne({ email: req.body.email })
        .then(dbData => {
            if(dbData) {

                const validPassword = bcrypt.compareSync(req.body.password, dbData.password); 
                
                if(!validPassword) {
                    return res.status(400).json({
                        error: loginErrorMessage
                    });
                }

                const token = jwt.sign({
                    user: {
                        _id: dbData._id,
                        name: dbData.name,
                        email: dbData.email
                    }
                },
                config.get('configToken.seed'),
                {
                    expiresIn: config.get('configToken.expiration')
                });
                
                return res.json({
                    user: {
                        _id: dbData._id,
                        name: dbData.name,
                        email: dbData.email
                    },
                    token
                });

            } else {
                res.status(400).json({
                    error: loginErrorMessage
                });
            }
        })
        .catch(err => {
            return res.status(400).json({
                error: 'Service error: ' + err
            });
        });
});

module.exports = routes;