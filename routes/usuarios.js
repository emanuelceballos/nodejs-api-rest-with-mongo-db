const express = require('express');
const bcrypt = require('bcrypt');
const routes = express.Router();
const Usuario = require('../models/usuario_model');
const Joi = require('joi');
const verifyToken = require('../middlewares/auth');

/* Joi validation */

const schema = Joi.object({
    nombre: Joi.string()
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
    let resultado = listarUsuariosActivos();

    resultado
        .then(usuarios => {
            return res.json(usuarios);
        })
        .catch(err => {
            return res.status(400).json({
                error: err
            });
        });
});

routes.post('/', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, user) => {
        if(err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if(user) {
            return res.status(400).json({ message: 'User already exists.' });
        }
    });

    const {error, value} = schema.validate({
        nombre: body.nombre,
        email: body.email
    });

    if(!error) {
        let resultado = crearUsuario(body);

        resultado
            .then(usuario => {
                res.json({
                    nombre: usuario.nombre,
                    email: usuario.email
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
        nombre: req.body.nombre
    });

    if(!error) {
        let resultado = actualizarUsuario(req.params.email, req.body);

        resultado
            .then(usuario => {
                res.json({
                    nombre: usuario.nombre,
                    email: usuario.email
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
    let resultado = desactivarUsuario(req.params.email);

    resultado
        .then(usuario => {
            res.json({
                nombre: usuario.nombre,
                email: valor.email
            })
        })
        .catch(err => {
            res.status(400).json({
                error: err
            })
        });
});

async function listarUsuariosActivos() {
    let usuarios = await
        Usuario
            .find({ 'estado': true })
            .select({ nombre: 1, email: 1 });

    return usuarios;
}

async function crearUsuario(body) {
    
    let hashedPassword = bcrypt.hashSync(body.password, 10);
    
    console.log(hashedPassword);

    let usuario = new Usuario({
        email:      body.email,
        nombre:     body.nombre,
        password:   hashedPassword
    });

    return await usuario.save();
}

async function actualizarUsuario(email, body) {
    let usuario = await Usuario.findOneAndUpdate({ 'email': email}, {
        $set: {
            nombre: body.nombre,
            password: body.password
        }
    }, {
        new: true
    });

    return usuario;
}

async function desactivarUsuario(email) {
    let usuario = await Usuario.findOneAndUpdate({ 'email': email}, {
        $set: {
            estado: false
        }
    }, {
        new: true
    });

    return usuario;
}

module.exports = routes;