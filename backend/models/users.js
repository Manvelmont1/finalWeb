'use strict'

let mongoose = require("mongoose");

// Valores de users:
let UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    nombre: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['admin', 'basic'],
        default: 'basic'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("users", UserSchema);
