const express = require('express');
const routes = express.Router();
const Curso = require('../models/curso_model');
const verifyToken = require('../middlewares/auth');

routes.get('/', verifyToken, (req, res) => {
    
    let resultado = listarCursosActivos();

    resultado
        .then(cursos => {
            return res.json(cursos);
        })
        .catch(err => {
            return res.status(400).json({
                err
            });
        });
});

routes.post('/', verifyToken, (req, res) => {
    let resultado = crearCurso(req);

    resultado
        .then(curso => {
            res.json({
                curso
            });
        })
        .catch(err => {
            res.status(400).json({
                err
            })
        });
});

routes.put('/:id', verifyToken, (req, res) => {
    
    let resultado = actualizarCurso(req.params.id, req.body);

    resultado
        .then(curso => {
            res.json({
                curso
            })
        })
        .catch(err => {
            res.status(400).json({
                err
            })
        });    
});

routes.delete('/:id', verifyToken, (req, res) => {
    let resultado = desactivarCurso(req.params.id);

    resultado
        .then(curso => {
            res.json({
                curso
            })
        })
        .catch(err => {
            res.status(400).json({
                error: err
            })
        });
});

async function listarCursosActivos() {
    let cursos = await Curso
        .find({ 'estado': true });
        
    return cursos;
}

async function crearCurso(req) {
    
    let curso = new Curso({
        titulo:         req.body.titulo,
        descripcion:    req.body.descripcion,
        // autor:          req.user._id
        autor: req.user
    });

    return await curso.save();
}

async function actualizarCurso(id, body) {
    let curso = await Curso.findByIdAndUpdate(id, {
        $set: {
            titulo: body.titulo,
            descripcion: body.descripcion
        }
    }, {
        new: true
    });

    return curso;
}

async function desactivarCurso(id) {
    let curso = await Curso.findByIdAndUpdate(id, {
        $set: {
            estado: false
        }
    }, {
        new: true
    });

    return curso;
}

module.exports = routes;