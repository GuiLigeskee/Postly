const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("postly", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("conectado ao banco de dados");
} catch (err) {
  console.log(`Não conectado ao banco de dados: ${err}`);
}

module.exports = sequelize;
