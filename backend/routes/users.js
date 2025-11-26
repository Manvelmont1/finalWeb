'use strict'

let express = require("express");
let userController = require("../controllers/users");
let auth = require("../helpers/auth");

let router = express.Router();

// Registro de usuario (público)
router.post("/api/user", userController.createUser);

// Login (público)
router.post("/api/login", userController.loginUser);

// Obtener perfil propio (requiere autenticación)
router.get("/api/user/profile", auth.validateToken, userController.getUserProfile);

module.exports = router;
