const DB = require('../utils/db');
const Level = require('../models/levels_model');
const Avatar = require('../models/avatar_model');
const Hint = require('../models/hints_model');
const AdminRouter = require('express').Router();
const adminAuth = require("../middleware/authAdmin");
const {loginRateLimiter}=require("../middleware/rateLimiter")

//init firebase app
const { initializeApp } = require('firebase/app')
const { getAuth, signInWithEmailAndPassword } = require('@firebase/auth')

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)


AdminRouter.post('/signUp',loginRateLimiter, async (req, res) => {

    const credentials = {
        email: req.body.email,
        password: req.body.password
    }
    try {
        const loggedInAdmin = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)

        if (loggedInAdmin) {
            res.status(200).json(loggedInAdmin.user.uid)
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
})

AdminRouter.get('/popularLevels', adminAuth, async (req, res) => {
    try {
        const popularLevels = await new DB().PopularLevelMapReduce("users")
        console.log(popularLevels)
        if (popularLevels) {
            return res.status(200).json(popularLevels)
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
})

//total popular avg levels
AdminRouter.get('/TotalPopularAvg', adminAuth, async (req, res) => {
    try {
        const popularLevels = await new DB().TotalLevelPopularityAvg("users")
        const totalPersons=popularLevels.reduce((curr,b)=>{return curr + b.persons},0)
        const totalAvg = popularLevels.reduce((curr,b)=>{return curr + (b.persons/totalPersons*b.lvlAvg)},0);
        
        if (totalAvg) {
            return res.status(200).send(totalAvg.toFixed(2))
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
})




AdminRouter.get('/TotalRegistration/:year', adminAuth, async (req, res) => {
    try {
        const amountOfRegisterationUsers = await new DB().AmountOfRegestation("users", req.params.year)
        const amountOfRegisterationGuests = await new DB().AmountOfRegestation("guests", req.params.year)
        const amountOfRegisteration = [...amountOfRegisterationUsers, ...amountOfRegisterationGuests]
        const result = amountOfRegisteration.reduce((acc, curr) => {
            const index = acc.findIndex(item => item._id === curr._id)
            index > -1 ? acc[index].Value += curr.Value : acc.push({
                _id: curr._id,
                Value: curr.Value
            })
            return acc
        }, [])
        if (result) {
            return res.status(200).json(result.sort((a,b)=>a._id-b._id))
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
})

AdminRouter.get('/LevelRankAvg', adminAuth, async (req, res) => {
    try {
        const levelRankingAvg = await new DB().LevelRankningAvg("users")
        if (levelRankingAvg) {
            return res.status(200).json(levelRankingAvg)
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
AdminRouter.get('/popHours', adminAuth, async (req, res) => {
    try {
        const popularHours = await new DB().PlayTimePeriudPop("users")
        if (popularHours) {
            return res.status(200).json(popularHours)
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
})

AdminRouter.get('/TotalPlayTime', adminAuth, async (req, res) => {
    try {
        const popularHours = await new DB().TotalPlayTime("users")
        const totalAmount=popularHours.reduce((a,b)=>{return a+b.Amount},0)
        if (totalAmount) {
            return res.status(200).json(totalAmount)
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
})

//users controllers
AdminRouter.post('/users/add', adminAuth, async (req, res) => {
    try {
        let { nickname, email, password, avatars, gender } = req.body;
        let user = new User(nickname, email, password, avatars, gender);
        let data = await new DB().Insert("users", user);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//get amount of users and guests registerd
AdminRouter.get('/users/amountOfUsers/', adminAuth, async (req, res) => {
    try {
        let data = await new DB().FindAmount("users");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//get amount of users and guests registerd
AdminRouter.get('/guests/amountOfGuests/', adminAuth, async (req, res) => {
    try {
        let data = await new DB().FindAmount("guests");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Update
AdminRouter.put('/users/update/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let { nickname, email, password, current_level, level_rank, avatars, gender } = req.body;
        let user = new User(nickname, email, password, current_level, level_rank, avatars, gender);
        let data = await new DB().UpdateDocById("users", id, user);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Delete
AdminRouter.put('/users/delete/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().DeactivateDocById("users", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Reactive
AdminRouter.put('/users/reactive/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().ReactivateDocById("users", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});
//Read all
AdminRouter.get('/users/', adminAuth, async (req, res) => {
    try {
        let data = await new DB().FindAll("users");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//levels controllers
//Read one
AdminRouter.get('/levels/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params; //get the id param.
        let data = await new DB().FindByID("levels", id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});
AdminRouter.get('/levels', adminAuth, async (req, res) => {
    try {
        let data = await new DB().FindAll("levels");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});
//Create
AdminRouter.post('/levels/add', adminAuth, async (req, res) => {
    try {
        let { code, map, player, enemies, step_cap, difficulty, end_point } = req.body;
        let level = new Level(code, map, player, enemies, step_cap, difficulty, end_point);
        let data = await new DB().Insert("levels", level);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Update
AdminRouter.put('/levels/update/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let { code, map, player, enemies, step_cap, difficulty } = req.body;
        let level = new Level(code, map, player, enemies, step_cap, difficulty);
        let data = await new DB().UpdateDocById("levels", id, level);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Delete
AdminRouter.delete('/levels/delete/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().DeactivateDocById("levels", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Reactive
AdminRouter.put('/levels/reactive/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().ReactivateDocById("levels", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//hints controllers
//Read one
AdminRouter.get('/hints/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params; //get the id param.
        let data = await new DB().FindByID("hints", id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Create
AdminRouter.post('/hints/add', adminAuth, async (req, res) => {
    try {
        let { name, description } = req.body;
        let hint = new Hint(name, description);
        let data = await new DB().Insert("hints", hint);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Update
AdminRouter.put('/hints/update/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let { name, description } = req.body;
        let hint = new Hint(name, description);
        let data = await new DB().UpdateDocById("hints", id, hint);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Delete
AdminRouter.delete('/hints/delete/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().DeactivateDocById("hints", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Reactive
AdminRouter.put('/hints/reactive/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().ReactivateDocById("hints", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});
//avatars
//Read one
AdminRouter.get('/avatars/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params; //get the id param.
        let data = await new DB().FindByID("avatars", id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Create
AdminRouter.post('/avatars/add', adminAuth, async (req, res) => {
    try {
        let { gender, options } = req.body;
        let avatar = new Avatar(gender, options);
        let data = await new DB().Insert("avatars", avatar);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Update
AdminRouter.put('/avatars/update/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let { gender, options } = req.body;
        let avatar = new Avatar(gender, options);
        let data = await new DB().UpdateDocById("avatars", id, avatar);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});
//remove option from avatar options
AdminRouter.put('/avatars/update/avatarOption/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let { code } = req.body;
        let data = await new DB().removeAvatarOption("avatars", id, code);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//add choice option in avatar option array
AdminRouter.put('/avatars/update/addAvatarOption/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;

        let data = await new DB().addAvatarOption("avatars", id, req.body);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});



//Delete
AdminRouter.delete('/avatars/delete/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().DeactivateDocById("avatars", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//Reactive
AdminRouter.put('/avatars/reactive/:id', adminAuth, async (req, res) => {
    try {
        let { id } = req.params;
        let data = await new DB().ReactivateDocById("avatars", id);
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

//guest
AdminRouter.get('/guests', adminAuth, async (req, res) => {
    try {
        //get the id param.
        let data = await new DB().FindAll("guests");
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error });
    }
});

AdminRouter.get("/lifes", adminAuth,async (req, res) => {
    try {
      let data = await new DB().FindAll("life");
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error });
    }
  });

  AdminRouter.put("/updateLife", adminAuth,async (req, res) => {
    try {
      let lifeObj=req.body
     
      let data = await new DB().FindAll("life");
      data[0].addedLifeForRegister=lifeObj.user
      data[0].addedLifeForGuest=lifeObj.guest
      const updatedData=await new DB().UpdateDocById("life",data[0]._id,data[0])
      res.status(200).json(updatedData);
    } catch (error) {
      res.status(500).json({ error });
    }
  });


module.exports = AdminRouter;