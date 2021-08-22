const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.USER_DB,
  host: process.env.HOST,
  password: process.env.PASSWORD_DB,
  port: process.env.PORT_DB,
  database: process.env.DATABASE,
});

const insertarUsuario = async (datos) => {
  const consulta = {
    text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) values($1, $2, $3, $4, $5, $6, $7)",
    values: datos,
  };
  const result = await pool.query(consulta);
  return result;
};

const consultarUsuarios = async () => {
  const usuarios = await pool.query("SELECT * FROM skaters");
  return usuarios;
};

const deleteUsuario = async (id) => {
  const result = await pool.query(`DELETE FROM skaters WHERE id = '${id}' RETURNING*`);
  return result;
};

const actualizarUsuario = async (datos) => {
  const consulta = {
    text: "UPDATE skaters SET nombre =$1, password = $2, anos_experiencia = $3, especialidad = $4 WHERE id = $5 RETURNING*",
    values: datos,
  };
  const result = await pool.query(consulta);
  return result;
};

const editarEstados = async (datos) => {
  const consulta = {
    text: "UPDATE skaters SET estado = not estado where id = $1",
    values: datos,
  };
  const result = await pool.query(consulta);
  return result;
}

module.exports = {
  insertarUsuario,
  consultarUsuarios,
  deleteUsuario,
  actualizarUsuario,
  editarEstados
};




