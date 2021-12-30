'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // 먼저 column 추가하고 외래키로 추가
    await queryInterface.addColumn("images", "UserId", {
      type: Sequelize.INTEGER
    })
    await queryInterface.addConstraint('images', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'UserId',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
