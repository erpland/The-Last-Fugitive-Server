const User = require('../models/user_model');
const DB = require('../utils/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRouter = require('express').Router();
const auth = require("../middleware/auth");
//CRUD

//user cruds
//Read one
UserRouter.get('/:id', async (req, res) => {
  try {
    let { id } = req.params; //get the id param.
    let data = await new DB().FindByID("users", id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});
//Register
UserRouter.post("/register", async (req, res) => {


  try {
    // Get user input
    let { nickname, email, password, avatarCode, gender, avatarUrl } = req.body

    // Validate user input
    if (!(nickname && email && password && avatarCode >= 0 && gender && avatarUrl)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await new DB().FindByEmail("users", email);

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }


    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    let user = new User(nickname, email.toLowerCase(), encryptedPassword, avatarCode, gender, avatarUrl);
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY
    );
    // save user token
    user.token = token;
    await new DB().Insert("users", user);



    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }

});
//Login
UserRouter.post("/login", async (req, res) => {

  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await new DB().FindByEmail("users", email);
    
    if (user && (await bcrypt.compare(password, user.password))) {
      if(!user.isActive){return res.status(403).send("User is Banned!!")}
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    }
    res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
  }
});
//sign up user as guest
UserRouter.post("/guestRegister", async (req, res) => {

  try {

    // Get user input
    let { nickname, email, password,gender,id,avatarCode,avatarUrl } = req.body
    const guest = await new DB().FindByID("guests", id)

    // Validate user input
    if (!(nickname && email && password&&avatarCode >= 0 && gender && avatarUrl)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await new DB().FindByEmail("users", email);

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    let user = new User(nickname, email.toLowerCase(), encryptedPassword, avatarCode, gender, 
    avatarUrl,guest.level_rank,guest.current_level,guest.is_notification,guest.time_of_register,guest.play_dates);
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY
    );
    // save user token
    user.token = token;
    await new DB().Insert("users", user);
    // return new user
    res.status(201).json(user);
   await new DB().DeleteDocById("guests",guest._id)
  } catch (err) {
    console.log(err);
  }

});
//following controllers require auth token:

//update avatar
UserRouter.put('/update/avatar/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;

    let data = await new DB().UpdateAvatar("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//update NickName
UserRouter.put('/update/nickName/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateNickName("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//update notification:
UserRouter.put('/update/notification/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateNotifications("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});
//add play date to play dates arr
UserRouter.put('/update/addPlayDate/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().addPlayDate("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});
//update current level in user doc 
UserRouter.put('/update/currentLevel/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateCurrentLevel("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});

//update level popularity in user doc 
UserRouter.put('/update/levelPopularity/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateLevelPopularity("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});


//update current level in user doc 
UserRouter.put('/update/levelRank/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().UpdateLevelRank("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});


//add level rank to level rank arr
UserRouter.put('/update/addLevelRank/:id', auth, async (req, res) => {
  try {
    let { id } = req.params;
    let data = await new DB().addLevelRank("users", id, req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error });
  }
});



module.exports = UserRouter;