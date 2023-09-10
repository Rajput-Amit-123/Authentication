require("dotenv").config();
require("./config/database").connect();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const { models } = require("mongoose");
const app = express();
const User = require('./model/user');
const auth = require('./middleware/auth');

app.use(express.json());

app.post("/register", async (req, res) => {
    //register logic
    try {
        const { first_name, last_name, email, password } = req.body;

        //if any feild is empty
        if (!(email && password && first_name && last_name)) {
            res.status(400).send("All feild is required!");
        }

        //check if user is already exists 
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User is already exist | please try to login");
        }
        // Password encryption
        encryptedPassword = await bcrypt.hash(password, 10);

        //create user in database
        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });
        user.save();

        //create token 
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            { expiresIn: "2h" },
        );
        // save user token
        user.token = token;
        // return new user
        res.status(201).json(user);
    } catch (error) {
        console.log(`your error is: ${error}`);
    }
})

app.post("/login", async (req, res) => {
    try {
        //accepting perameters form request
        const { email, password } = req.body;

        //cheking if all entered
        if (!(email && password)) {
            res.status(400).send("Please Enter All required details");
        }

        //now valid the user
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            //create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // asign created token to the user
            user.token = token;

            //return the user
            res.status(200).json(user);
        }
        else
        res.status(400).send(`User Not exist || please try to register first`)


    } catch (error) {
        console.log(`There is some error: ${error}`);
    }
})

app.get('/home',auth,(req,res)=>{
    res.status(200).send("welcome to the home page");
})

app.get('/contect_us', auth, (req, res) => {
    res.status(200).send("welcome to the Contect us From page");
})

module.exports = app;