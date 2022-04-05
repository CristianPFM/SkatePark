const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
path = require("path");

const {
  insertarUsuario,
  consultarUsuarios,
  deleteUsuario,
  actualizarUsuario,
} = require("../consultas");

exports.renderMain = async (req, res) => {
  const usuarios = await consultarUsuarios();
  const users = { ...usuarios.rows };
  res.render("main", { layout: "main", users });
};

exports.renderRegistro = (req, res) => {
  res.render("registro", { layout: "registro" });
};

exports.postRegistro = async (req, res) => {
  const { email, nombre, password, experiencia, especialidad } = req.body;
  const { foto } = req.files;
  const fotoName = `${Date.now()}.jpg`;
  const estado = false;
  try {
    const pass = await bcrypt.hash(password, 10);
    const datosRegistro = [
      email,
      nombre,
      pass,
      experiencia,
      especialidad,
      fotoName,
      estado,
    ];
    await insertarUsuario(datosRegistro);
    foto.mv(path.join(__dirname, `../assets/img/${fotoName}`), (err) => {
      res.redirect("/login");
    });
  } catch (error) {
    console.log(error);
    res.send(error.detail);
  }
};

exports.renderLogin = (req, res) => {
  res.render("login", { layout: "login" });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  const usuarios = await consultarUsuarios();
  const usuario = usuarios.rows.find((u) => u.email == email);
  if (usuario) {
    const validarLogin = await bcrypt.compare(password, usuario.password);
    if (validarLogin) {
      const token = jwt.sign(usuario, process.env.SECRETKEY);
      res.send(`
          <script>
          localStorage.setItem('token', JSON.stringify("${token}"))
          location.replace("/datosperfil?token=${token}")
          </script>
          `);
    } else {
      res.send("Contraseña No Valida");
    }
  } else {
    res.send("Usuario No Encontrado");
  }
};

exports.renderDatosPerfil = (req, res) => {
  let { token } = req.query;
  jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
    console.log("GET datos de perfil", decoded);
    err
      ? res.status(401).send({
          error: "401 Sin Autorizacion",
          message: err.message,
        })
      : res.render("datosPerfil", { layout: "datosPerfil", decoded });
  });
};

exports.eliminarPerfil = async (req, res) => {
  console.log(req.params)
  const { id } = req.params;
  try {
    const result = await deleteUsuario(id);
    if (result.rowCount > 0) {
      res.sendStatus(200, 'OK');

    }
  } catch (error) {
    console.log(error);
  }
};

exports.actualizarPerfil = async (req, res) => {
  const { nombre, password, experiencia, especialidad, id } = req.body;
  console.log(nombre, password, experiencia, especialidad, id);
  try {
    const pass = await bcrypt.hash(password, 10);
    const datosActualizados = [nombre, pass, experiencia, especialidad, id];
    await actualizarUsuario(datosActualizados);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};
