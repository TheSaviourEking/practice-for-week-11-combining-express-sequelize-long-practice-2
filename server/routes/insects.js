// Instantiate router - DO NOT MODIFY
const express = require('express');
const router = express.Router();

const { Insect } = require('../db/models');
const { Op } = require('sequelize');

/**
 * INTERMEDIATE BONUS PHASE 2 (OPTIONAL) - Code routes for the insects
 *   by mirroring the functionality of the trees
 */
// Your code here
router.get('/', async (req, res, next) => {
    const insectsByHeight = await Insect.findAll({
        attributes: ['id', 'name', 'millimeters'],
        order: [['millimeters']]
    });
    res.json(insectsByHeight);
});

router.get('/:id', async (req, res, next) => {
    const insect = await Insect.findByPk(req.params.id);
    res.json(insect)
})

router.post('/', async (req, res, next) => {
    try {
        const { name, description, fact, territory, millimeters } = req.body;
        const insect = await Insect.build({
            name, description, fact, territory, millimeters
        })
        await insect.save();
        if (insect) res.json(insect);
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
})

router.delete('/:id', async (req, res, next) => {
    const insect = await Insect.findByPk(req.params.id);
    if (insect) await insect.destroy();

    res.json({ message: `Successfully deleted ${insect.name} with id ${insect.id}` })
})

router.put('/:id', updateInsect);
router.patch('/:id', updateInsect);

async function updateInsect(req, res, next) {
    try {
        // const payLoad = { id, name, description, fact, territory, millimeters, createdAt, updatedAt } = req.body;
        const payLoad = { ...req.body };
        if (Number(req.params.id) !== Number(payLoad.id)) throw new Error('Id\'s must match');

        const insect = await Insect.findByPk(req.params.id);

        const updInsect = {
            id: payLoad.id ? payLoad.id : insect.id,
            name: payLoad.name ? payLoad.name : insect.name,
            description: payLoad.description ? payLoad.description : insect.description,
            fact: payLoad.fact ? payLoad.fact : insect.fact,
            territory: payLoad.territory ? payLoad.territory : insect.territory,
            millimeters: payLoad.millimeters ? payLoad.millimeters : insect.millimeters,
            createdAt: payLoad.createdAt ? payLoad.createdAt : insect.createdAt,
            updatedAt: payLoad.updatedAt ? payLoad.updatedAt : insect.updatedAt
            // updatedAt: payLoad.updatedAt || insect.updatedAt
        }
        console.log(updInsect.updatedAt, '---------------------------')
        await insect.set({
            ...updInsect
        })
        console.log(insect.updatedAt, '----------insect')
        await insect.save();

        res.json({
            message: 'Successsfully update insect',
            data: insect
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
}

// Export class - DO NOT MODIFY
module.exports = router;
