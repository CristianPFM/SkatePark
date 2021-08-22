const {
    consultarUsuarios,
    editarEstados,
  } = require("../consultas");

exports.renderAdmin = async (req, res) => {
    const usuarios = await consultarUsuarios();
    const users = { ...usuarios.rows };
    res.render("admin", { layout: "admin", users });
  }

exports.editarEstados = async (req, res) => {
    const data = req.body;
    const id = Object.keys(data);
    console.log(id);
    await editarEstados(id);
    res.render("admin", { layout: "admin" });
  }
