const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const routes = express.Router();
const Usuario = require('../models/usuario_model');
const config = require('config');

routes.post('/', (req, res) => {
    
    const loginErrorMessage = 'Incorrect user or password.';

    Usuario
        .findOne({ email: req.body.email })
        .then(datos => {
            if(datos) {

                const validPassword = bcrypt.compareSync(req.body.password, datos.password);
                
                if(!validPassword) {
                    return res.status(400).json({
                        error: loginErrorMessage
                    });
                }

                const token = jwt.sign({
                    user: {
                        _id: datos._id,
                        nombre: datos.nombre,
                        email: datos.email
                    }
                },
                config.get('configToken.seed'),
                {
                    expiresIn: config.get('configToken.expiration')
                });
                
                return res.json({
                    user: {
                        _id: datos._id,
                        nombre: datos.nombre,
                        email: datos.email
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