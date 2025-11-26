'use strict';

let express = require("express");
let router = express.Router();
let reviewController = require("../controllers/reviews");
let auth = require("../helpers/auth");

// Todas las rutas requieren autenticación

// Crear una nueva reseña
router.post("/api/reviews", auth.validateToken, reviewController.createReview);

// Obtener todas las reseñas
router.get("/api/reviews", auth.validateToken, reviewController.getAllReviews);

// Obtener mis reseñas
router.get("/api/reviews/my-reviews", auth.validateToken, reviewController.getMyReviews);

// Filtrar reseñas por calificación
router.get("/api/reviews/filter", auth.validateToken, reviewController.getReviewsByRating);

// Obtener reseñas de un usuario específico
router.get("/api/reviews/user/:userId", auth.validateToken, reviewController.getUserReviews);

// Actualizar una reseña (solo el propietario)
router.put("/api/reviews/:id", auth.validateToken, reviewController.updateReview);

// Eliminar una reseña (solo el propietario)
router.delete("/api/reviews/:id", auth.validateToken, reviewController.deleteReview);

module.exports = router;
