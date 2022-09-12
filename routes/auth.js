const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { request } = require("express");
const jwt = require("jsonwebtoken")




router.post("/register", async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { username, email, password } = req.body;
  
      // Validate user input
      if (!(email && password && username)) {
        res.status(400).send("All input is required");
      }
  
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        username,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        "secretKey",
        {
          expiresIn: "1h",
        }
      );
      // save user token
      user.token = token;
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  
// ...

router.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { username, password } = req.body;
  
      // Validate user input
      if (!(username && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database
      const user = await User.findOne({ username });
  
      if (user && (await bcrypt.compare(password, user.password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, username },
          "secretKey",
          {
            expiresIn: "1h",
          }
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
    // Our register logic ends here
  });




module.exports = router;


  
//REGISTER USER
// router.post('/signup', async (req, res) => {

//     try{
//         //generate password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(req.body.password, salt);

//         //create new user
//         const newUser = new User({
//             username: req.body.username,
//             email: req.body.email,
//             password: hashedPassword,
//         });

//         //save user
//         const user = await newUser.save();
//         res.status(201).json(user)
//     }
//     catch (err){
//         res.status(500).json(err)
//     }
// });

// //LOGIN USER

// router.post('/signin', async (req, res) => {
//     try
//     {
//         const user = await User.findOne({ username: req.body.username });
//         !user && res.status(404).json("User not found");


//         const validPassword = await bcrypt.compare(req.body.password, user.password)
//         !validPassword && res.status(400).json({status: "failed", message: "wrong username or password" })

//         res.status(200).json(user)
//     } catch (err){
//         res.status(500).json(err);
//     }


// })

//==========================///


// ...


  
  // ...