const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const autorSchema = new mongoose.Schema({
    nombre: String,
    email: String
});

const cursoSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    // autor: {
    //     type: Schema.Types.ObjectId, ref: 'Usuario'
    // },
    autor: autorSchema,
    descripcion: {
        type: String,
        required: true
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    },
    imagen: {
        type: String,
        required: false
    },
    alumnos: {
        type: Number,
        default: 0
    },
    calificacion: {
        type: Number
    }
});

module.exports = mongoose.model('Curso', cursoSchema);