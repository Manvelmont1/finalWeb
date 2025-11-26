'use strict';

let Review = require("../models/reviews");

// Crear una nueva reseña
function createReview(req, resp) {
    let requestBody = req.body;

    if (!requestBody) {
        return resp.status(400).send({"message": "El body no fue enviado o es invalido"});
    }
    
    if (!requestBody.titulo || !requestBody.contenido || !requestBody.calificacion) {
        return resp.status(400).send({"message": "Estos valores son necesarios: (titulo, contenido, calificacion)"});
    }
    
    if (!requestBody.titulo.trim() || !requestBody.contenido.trim()) {
        return resp.status(400).send({"message": "Titulo y contenido no pueden estar vacios!"});
    }
    
    if (requestBody.calificacion < 1 || requestBody.calificacion > 5) {
        return resp.status(400).send({"message": "La calificacion debe estar entre 1 y 5"});
    }
    
    // Crear nueva reseña:
    let newReview = new Review();
    newReview.titulo = requestBody.titulo.trim();
    newReview.contenido = requestBody.contenido.trim();
    newReview.calificacion = requestBody.calificacion;
    newReview.usuario = req.user.id; // Del token
    newReview.emailUsuario = req.user.email; // Del token
    
    if (requestBody.nombreUsuario) {
        newReview.nombreUsuario = requestBody.nombreUsuario.trim();
    }
    
    if (requestBody.categoria) {
        newReview.categoria = requestBody.categoria;
    }

    newReview.save().then(
        (savedReview) => {
            resp.status(201).send({
                "message": "Reseña creada exitosamente!", 
                "review": savedReview
            });
        },
        err => {
            resp.status(500).send({"message": "Error al crear la reseña", "error": err});
        }
    );
}

// Obtener todas las reseñas
function getAllReviews(req, resp) {
    Review.find({})
        .sort({ createdAt: -1 }) // Ordenar por más recientes primero
        .then(
            (reviews) => {
                resp.status(200).send({
                    "message": "Lista de reseñas",
                    "reviews": reviews,
                    "count": reviews.length
                });
            },
            err => {
                resp.status(500).send({"message": "Error al mostrar las reseñas", "error": err});
            }
        );
}

// Obtener reseñas de un usuario específico
function getUserReviews(req, resp) {
    let userId = req.params.userId || req.user.id; // Puede ver sus propias reseñas o las de otro usuario
    
    Review.find({ usuario: userId })
        .sort({ createdAt: -1 })
        .then(
            (reviews) => {
                resp.status(200).send({
                    "message": "Reseñas del usuario",
                    "reviews": reviews,
                    "count": reviews.length
                });
            },
            err => {
                resp.status(500).send({"message": "Error al buscar las reseñas", "error": err});
            }
        );
}

// Obtener reseñas propias del usuario autenticado
function getMyReviews(req, resp) {
    Review.find({ usuario: req.user.id })
        .sort({ createdAt: -1 })
        .then(
            (reviews) => {
                resp.status(200).send({
                    "message": "Mis reseñas",
                    "reviews": reviews,
                    "count": reviews.length
                });
            },
            err => {
                resp.status(500).send({"message": "Error al buscar las reseñas", "error": err});
            }
        );
}

// Actualizar una reseña (solo el propietario)
function updateReview(req, resp) {
    let reviewId = req.params.id;
    let requestBody = req.body;
    
    if (!reviewId) {
        return resp.status(400).send({"message": "Se necesita el ID de la reseña"});
    }
    
    Review.findById(reviewId).then(
        (review) => {
            if (!review) {
                return resp.status(404).send({"message": "Reseña no encontrada"});
            }
            
            // Verificar que el usuario sea el propietario de la reseña
            if (review.usuario.toString() !== req.user.id) {
                return resp.status(403).send({"message": "No tienes permiso para editar esta reseña"});
            }
            
            // Actualizar campos
            if (requestBody.titulo) {
                review.titulo = requestBody.titulo.trim();
            }
            if (requestBody.contenido) {
                review.contenido = requestBody.contenido.trim();
            }
            if (requestBody.calificacion) {
                if (requestBody.calificacion < 1 || requestBody.calificacion > 5) {
                    return resp.status(400).send({"message": "La calificacion debe estar entre 1 y 5"});
                }
                review.calificacion = requestBody.calificacion;
            }
            if (requestBody.categoria) {
                review.categoria = requestBody.categoria;
            }
            
            review.updatedAt = Date.now();
            
            review.save().then(
                (updatedReview) => {
                    resp.status(200).send({
                        "message": "Reseña actualizada exitosamente",
                        "review": updatedReview
                    });
                },
                err => {
                    resp.status(500).send({"message": "Error al actualizar la reseña", "error": err});
                }
            );
        },
        err => {
            resp.status(500).send({"message": "Error al buscar la reseña", "error": err});
        }
    );
}

// Eliminar una reseña (solo el propietario)
function deleteReview(req, resp) {
    let reviewId = req.params.id;
    
    if (!reviewId) {
        return resp.status(400).send({"message": "Se necesita el ID de la reseña"});
    }
    
    Review.findById(reviewId).then(
        (review) => {
            if (!review) {
                return resp.status(404).send({"message": "Reseña no encontrada"});
            }
            
            // Verificar que el usuario sea el propietario de la reseña
            if (review.usuario.toString() !== req.user.id) {
                return resp.status(403).send({"message": "No tienes permiso para eliminar esta reseña"});
            }
            
            Review.findByIdAndDelete(reviewId).then(
                () => {
                    resp.status(200).send({
                        "message": "Reseña eliminada exitosamente"
                    });
                },
                err => {
                    resp.status(500).send({"message": "Error al eliminar la reseña", "error": err});
                }
            );
        },
        err => {
            resp.status(500).send({"message": "Error al buscar la reseña", "error": err});
        }
    );
}

// Filtrar reseñas por calificación
function getReviewsByRating(req, resp) {
    let minRating = parseInt(req.query.minRating) || 1;
    let maxRating = parseInt(req.query.maxRating) || 5;
    
    if (minRating < 1 || maxRating > 5 || minRating > maxRating) {
        return resp.status(400).send({"message": "Valores de calificacion invalidos"});
    }
    
    Review.find({
        calificacion: { $gte: minRating, $lte: maxRating }
    })
    .sort({ createdAt: -1 })
    .then(
        (reviews) => {
            resp.status(200).send({
                "message": "Reseñas filtradas por calificacion",
                "filters": {
                    "minRating": minRating,
                    "maxRating": maxRating
                },
                "reviews": reviews,
                "count": reviews.length
            });
        },
        err => {
            resp.status(500).send({"message": "Error al buscar las reseñas", "error": err});
        }
    );
}

module.exports = { 
    createReview, 
    getAllReviews, 
    getUserReviews, 
    getMyReviews,
    updateReview, 
    deleteReview,
    getReviewsByRating 
};
