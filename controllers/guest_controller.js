const Guest=require('../models/guest_model')
const jwt = require('jsonwebtoken');
const DB = require('../utils/db');
const GuestRouter = require('express').Router();
const auth = require("../middleware/auth");

//sign up user as guest
GuestRouter.post("/register", async (req, res) => {
  try {
    // Create guest user in db
    let guest = new Guest();
    let nickname=guest.nickname
     // Create token
     const token = jwt.sign(
      { user_id: guest._id, nickname },
      process.env.TOKEN_KEY
    );
    // save user token
    guest.token = token;
    await new DB().Insert("guests", guest);
    // return new user
    res.status(201).json(guest);
  } catch (err) {
    console.log(err);
  }
  });
  
  //update notification:
  GuestRouter.put('/update/notification/:id', auth, async (req, res) => {
    try {
      let { id } = req.params;
      let data = await new DB().UpdateNotifications("guests", id, req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  //add play date to play dates arr
  GuestRouter.put('/update/addPlayDate/:id', auth, async (req, res) => {
    try {
      let { id } = req.params;
      let data = await new DB().addPlayDate("guests", id, req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  //update current level in user doc 
  GuestRouter.put('/update/currentLevel/:id', auth, async (req, res) => {
    try {
      let { id } = req.params;
      let data = await new DB().UpdateCurrentLevel("guests", id, req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  
  //update level popularity in user doc 
  GuestRouter.put('/update/levelPopularity/:id', auth, async (req, res) => {
    try {
      let { id } = req.params;
      let data = await new DB().UpdateLevelPopularity("guests", id, req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  
  //update current level in user doc 
  GuestRouter.put('/update/levelRank/:id', auth, async (req, res) => {
    try {
      let { id } = req.params;
      let data = await new DB().UpdateLevelRank("guests", id, req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
  });
  
  
  //add level rank to level rank arr
  GuestRouter.put('/update/addLevelRank/:id', auth, async (req, res) => {
    try {
      let { id } = req.params;
      let data = await new DB().addLevelRank("guests", id, req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

  //fetch the guest by id
  GuestRouter.get('/:id', async (req, res) => {
    try {
      let { id } = req.params; //get the id param.
      let data = await new DB().FindByID("guests", id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
  });
 
  module.exports = GuestRouter;


 