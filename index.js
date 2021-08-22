const express = require("express");
const app = express();


const exphbs = require("express-handlebars");
const hbs = exphbs.create({
  layoutsDir: __dirname + "/views",
  partialsDir: __dirname + "/views/partials",
  helpers: {
    inc: function (value) {
      return parseInt(value) + 1;
    },
  },
});
app.set("view engine", "handlebars");
app.engine("handlebars", hbs.engine);

const expressFileUpload = require("express-fileupload");
require("dotenv").config();
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


app.use("/", require("./router/usuarios"));
app.use("/admin", require("./router/admin"));

app.listen(3000, () => {
  console.log("El servidor está inicializado en el puerto 3000");
});