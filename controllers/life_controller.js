const Life = require("../models/life_model");
const DB = require("../utils/db");
const LifeRouter = require("express").Router();

LifeRouter.get("/client", async (req, res) => {
  try {
    const data = await new DB().FindAll("life");

    if (data[0].addedLifeForRegister.dueTo) {

      if (new Date(data[0].addedLifeForRegister.dueTo) >= new Date()) {
        
        data[0].registeredUserLife += data[0].addedLifeForRegister.amount;
      }
    }
    if (data[0].addedLifeForGuest.dueTo) {

      if (new Date(data[0].addedLifeForGuest.dueTo) >= new Date()) {
       
        data[0].guestUserLife += data[0].addedLifeForGuest.amount;
      }
    }

    let lifeObj = { user: data[0].registeredUserLife, guest: data[0].guestUserLife };

    res.status(200).json(lifeObj);
  } catch (error) {
    res.status(500).json({ error });
  }
});

LifeRouter.post("/createLife", async (req, res) => {
  try {
    let life = new Life();
    await new DB().Insert("life", life);
    res.status(200).json(life);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = LifeRouter;
