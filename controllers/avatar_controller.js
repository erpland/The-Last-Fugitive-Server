
const DB = require('../utils/db');

const AvatarRouter = require('express').Router();

//CRUD
//Read all
AvatarRouter.get('/', async (req, res) => {
    try {
        let data = await new DB().FindAll("avatars");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});



module.exports = AvatarRouter;