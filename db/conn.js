require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_DBNAME, // Nome do banco
  process.env.DB_USERNAME, // Usuário
  process.env.DB_PASSWORD, // Senha
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false,
  }
);

try {
  sequelize.authenticate();
  console.log("conectado ao banco de dados");
} catch (err) {
  console.log(`Não conectado ao banco de dados: ${err}`);
}

module.exports = sequelize;
