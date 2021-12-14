module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci',
  });
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
    db.Comment.belongsToMany(db.Comment, { through: 'Reply', as: 'Son', foreignKey: 'FatherId' });
    db.Comment.belongsToMany(db.Comment, { through: 'Reply', as: 'Father', foreignKey: 'SonId' });
  };
  return Comment;
};