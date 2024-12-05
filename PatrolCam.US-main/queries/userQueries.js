const user = require("../model/User");
var ObjectId = require('mongodb').ObjectId;

const getCurrentUserFirstName = async(req, res) => {

    if(req.session && req.session.user){
        const userId = req.session.user.id;
        const currentUser = await user.findById(userId);
        const nameString = ', ' + currentUser.firstname;
        res.json({ name: nameString });
    } else{
        res.json( { name: '!' } )
    }
}

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

    try {
        const oneUser = await user.findById(userID); 
        res.status(200).json(oneUser)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserPage = async (req, res) => {

    console.log('entering getUserPage');

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const items = await user.find().skip(skip).limit(limit);
        const totalItems = await user.countDocuments();

        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            page, 
            totalPages, 
            totalItems,
            items
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }


}


module.exports = { getAllUsers, getUserByID, getUserPage, getCurrentUserFirstName }