const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

//UPDATE a user

router.put('/update/:id', auth, async (req,res) => {
    if(req.body.UserId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err){
                return res.status(500).json(err)
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {$set: req.body,});    //or req.body.UserId
            res.status(200).json({status:"success", message:"account updated successfuly"})
        } catch (error) {
            return res.status(500).json(error)
        }
    }else{
        return res.status(403).json("you can update only your account")
    }
})

// delete a user

router.delete("/delete/:id", auth, async (req,res) => {
    if (req.body.UserId === req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json({
                status:  "success", 
                message:" User deleted successfully"
            });

        } catch (err){
            return res.status(500).json("user cant be deleted")
        }
    } else{
        return res.status(403).json("Cant delete user")
    }
});
// get a user
//user name or user id the query function

// router.get("/", async (req, res) => {
//     const userId = req.query.userId;
//     const username = req.query.username;
//     try {
//       const user = userId
//         ? await User.findById(req.params.id)
//         : await User.findOne({ username: username });
//       const { password, updatedAt, ...other } = user._doc;
//       res.status(200).json(other);
//     } catch (err) {
//       res.status(500).json(err.message);
//     }
//   });

router.get("/:id", auth, async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other)
    } catch (err){
        res.status(500).json(err.message);
    }
})


//get friends fetching with name username and image
router.get("/friends/:userId", async(req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followings.map(friendId => {
                return User.findById(friendId)
            })
        )
        let friendList = [];
        friends.map((friend) => {
            const{_id, username, profilePicture} = friend;
            friendList.push({ _id, username, profilePicture })
        });
        return res.status(200).json(friendList)

    } catch (error) {
        res.status(500).json(error)
        
    }
})


//follow user

router.put("/:id/follow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id);   //the user you want to follow
            const currentUser = await User.findById(req.body.userId);  // current user
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: {followers: req.body.userId} })
                await currentUser.updateOne({ $push: {followings: req.params.id } })
                res.status(200).json({
                    message: "User has been followed"
                })
            }else{
                return res.status(403).json({
                    message: "follower"
                })
            }
        }catch(err){
            return res.status(500).json(err)
        }
    }else{
        res.status(403).json({
            status: "failed",
            message: "You can't follow yourself."
        })
    }
})

// unfollow user

router.put("/:id/unfollow", async (req, res) => {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({ $pull: {followers: req.body.userId} })
                await currentUser.updateOne({ $pull: {followings: req.params.id } })
                return res.status(200).json({
                    status: "success",
                    message: "User successfuly Unfollowed "
                })
            }else{
                return res.status(403).json({
                    message: "You are currently not following this user"})}
            
        } catch (error) {
            return res.status(500).json({
                error})
        }
    }else{
        return res.status(403).json({
            message: "you cant unfollow yourself"})
    }
})

module.exports = router;