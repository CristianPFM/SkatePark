const express = require("express");
const router = express.Router();
const usuariosController = require('../controllers/usuarios')

router.get("/", usuariosController.renderMain );

router.get("/registro", usuariosController.renderRegistro);

router.post("/registro",usuariosController.postRegistro);

router.get("/login", usuariosController.renderLogin);

router.post("/login", usuariosController.postLogin);

router.get("/datosperfil", usuariosController.renderDatosPerfil);

router.delete("/eliminarperfil/:id", usuariosController.eliminarPerfil);

router.post("/actualizarperfil", usuariosController.actualizarPerfil);


module.exports = router;