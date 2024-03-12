'use strict';

const { Insect, Tree } = require('../models');

const insectTrees = [
  {
    name: 'Western Pygmy Blue Butterfly',
    trees: [
      { tree: 'General Sherman' },
      { tree: 'General Grant' },
      { tree: 'Lincoln' },
      { tree: 'Stagg' }
    ]
  },
  {
    name: 'Patu Digua Spider',
    trees: [
      { tree: 'Stagg' }
    ]
  }
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    for (const insectTree of insectTrees) {
      const { name, trees } = insectTree;
      const insect = await Insect.findOne({
        where: { name }
      });

      for (const tree of trees) {
        let foundTree = await Tree.findOne({ where: { tree: tree.tree } });
        await insect.addTree(foundTree);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
