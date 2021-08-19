const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const expressFileUpload = require("express-fileupload");
const bcrypt = require("bcrypt");
require('dotenv').config()
const {
  insertarUsuario,
  consultarUsuarios,
  deleteUsuario,
  actualizarUsuario,
  editarEstados
} = require("./consultas");
const jwt = require("jsonwebtoken");

const hbs = exphbs.create({
  layoutsDir: __dirname + "/views",
  partialsDir: __dirname + "/views/partials",
  helpers: { 
    inc: function(value) {
      return parseInt(value) + 1;
    }
  }


})
app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist/css")
);
app.use("/assets", express.static(__dirname + "/assets"));
app.use(
  expressFileUpload({
    limits: { fileSize: 5000000 },
    abortOnLimit: true,
    responseOnLimit:
      "El peso del archivo que intentas subir supera el limite permitido",
  })
);

app.set("view engine", "handlebars");
app.engine(
  "handlebars", hbs.engine  
  )
;

app.get("/", async (req, res) => {
  const usuarios = await consultarUsuarios();
  const users = { ...usuarios.rows };
  res.render("main", { layout: "main", users });
});


app.get("/registro", (req, res) => {
  res.render("registro", { layout: "registro" });
});

app.post("/registro", async (req, res) => {
  const { email, nombre, password, experiencia, especialidad } = req.body;
  const { foto } = req.files;
  const fotoName = `${email}.jpg`;
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
    console.log(datosRegistro);
    await insertarUsuario(datosRegistro);
    foto.mv(`${__dirname}/assets/img/${fotoName}`, (err) => {
      res.redirect("/login");
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", (req, res) => {
  res.render("login", { layout: "login" });
});

app.post("/login", async (req, res) => {
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
});

app.get("/datosperfil", (req, res) => {
  let { token } = req.query;
  jwt.verify(token, process.env.SECRETKEY, (err, decoded) => {
    console.log("GET datos de perfil",decoded);
    err
      ? res.status(401).send({
          error: "401 Sin Autorizacion",
          message: err.message,
        })
      : res.render("datosPerfil", { layout: "datosPerfil", decoded });
  });
});

app.delete("/eliminarperfil/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const respuesta = await deleteUsuario(id);
    respuesta > 0
      ? res.send(`El curso de id ${id} fue eliminado con éxito`)
      : res.send("No existe un curso registrado con ese id");
  } catch (error) {
    console.log(error);
  }
});

app.post("/actualizarperfil", async (req, res) => {
  const { nombre, password, experiencia, especialidad, id } = req.body;
  console.log(nombre, password, experiencia, especialidad, id);
  try {
    const pass = await bcrypt.hash(password, 10);
    const datosActualizados= [
      nombre,
      pass,
      experiencia,
      especialidad,
      id
    ];
    await actualizarUsuario(datosActualizados);
    res.redirect("/")
} catch (error) {
  console.log(error);
}});

app.get("/admin", async (req, res) => {
  const usuarios = await consultarUsuarios()
  const users = {... usuarios.rows}
  res.render("admin", { layout: "admin", users});
});

app.put("/editarestados", async (req, res)=>{
  const data = req.body;
  const id = Object.keys(data)
  console.log(id)
  await editarEstados(id)
  res.render("admin", { layout: "admin"});

})