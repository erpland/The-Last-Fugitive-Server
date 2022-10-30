//load env vars
require('dotenv').config();

//libraries
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');



//port
const PORT = process.env.PORT || 5008;

//create server
const server = express();
server.use(express.json()); //enable json support
server.use(cors()); //enable global access
server.use(helmet()); //more defense




//api routes
const passwordReset = require("./controllers/reset_password_controller");
server.use('/api/users', require('./controllers/user_controllers'));
server.use('/api/levels',require('./controllers/levels_controllers'));
server.use('/api/hints', require('./controllers/hints_controllers'));
server.use('/api/avatars', require('./controllers/avatar_controller'));
server.use('/api/guests', require('./controllers/guest_controller'));
server.use("/api/password-reset", passwordReset);
server.use("/api/admin",require("./controllers/admin_controllers"))
server.use("/api/life",require("./controllers/life_controller"))

server.listen(PORT, () => console.log(`http://localhost:${PORT}`));