'use strict'

let jwt = require("jwt-simple");
let moment = require("moment");

let secret = "sjbfjka@1849.uwu" 

function generateToken(user){
    let payload = {
        sub : user._id,
        email : user.email,
        role : user.role,
        iat : moment().unix(),
        exp : moment().add("24", "hours").unix() // Token válido por 24 horas
    }
    return jwt.encode(payload, secret);
}

function validateToken(req, resp, nextStep){
    try{
        let token = req.headers.authorization;
        if (!token) {
            return resp.status(401).send({"message": "No se ha ingresado el token"});
        }
        
        let cleanToken = token.replace("Bearer ", "");
        let payload = jwt.decode(cleanToken, secret);

        // Verificar si el token ha expirado
        if (payload.exp <= moment().unix()) {
            return resp.status(401).send({"message": "El token esta vencido"});
        }

        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role
        };
        nextStep();
    }
    catch(ex){
        resp.status(401).send({"message": "El token ingresado es invalido"});
    }
}

// Permiso de admin:
function requireAdmin(req, resp, nextStep) {
    if (req.user && req.user.role === 'admin') {
        nextStep();
    } else {
        resp.status(403).send({"message": "Se necesita rol de Administrator para hacer esto :( "});
    }
}

module.exports = {generateToken, validateToken, requireAdmin};
