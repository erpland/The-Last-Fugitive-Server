
const DB = require('../utils/db');

const HintRouter = require('express').Router();

//CRUD

//Read all
HintRouter.get('/', async (req, res) => {
    try {
        let data = await new DB().FindAll("hints");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});



module.exports = HintRouter;