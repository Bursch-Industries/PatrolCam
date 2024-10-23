const user = require("../model/User");
var ObjectId = require('mongodb').ObjectId;

const getAllUsers = async (req, res) => {
    

    try {
        const allUsers = await user.find({}); 
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getUserByID = async (req, res) => {
    
    const userID = req.params.id;
    const o_id = new ObjectId(userID);

    try {
        const oneUser = await user.find({"_id" : o_id}); 
        res.status(200).json(oneUser)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { getAllUsers, getUserByID }