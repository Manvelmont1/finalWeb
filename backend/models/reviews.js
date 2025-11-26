'use strict';

let mongoose = require('mongoose');

let Schema = mongoose.Schema;

// Schema de reseñas
let ReviewSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    calificacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    emailUsuario: {
        type: String,
        required: true
    },
    nombreUsuario: {
        type: String,
        required: false
    },
    categoria: {
        type: String,
        required: false,
        enum: ['Producto', 'Servicio', 'Restaurante', 'Película', 'Libro', 'Otro'],
        default: 'Otro'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('reviews', ReviewSchema);
