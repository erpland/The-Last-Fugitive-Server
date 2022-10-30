
const DB = require('../utils/db');

const LevelRouter = require('express').Router();

//CRUD

//Read all
LevelRouter.get('/', async (req, res) => {
    try {
        let data = await new DB().FindAll("levels");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});



module.exports = LevelRouter;