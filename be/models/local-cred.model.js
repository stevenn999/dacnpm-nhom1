// local credential
module.exports = (sequelize, Sequelize) => {
  const LocalCredential = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    }
  });
  return LocalCredential;
};