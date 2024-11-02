const user = require("../model/Organization");
var ObjectId = require('mongodb').ObjectId;

const getAllOrgs = async (req, res) => {
    

    try {
        const allUsers = await user.find({}); 
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getOrgByID = async (req, res) => {
    
    const userID = req.params.id;
    const o_id = new ObjectId(userID);

    try {
        const oneUser = await user.find({"_id" : o_id}); 
        res.status(200).json(oneUser)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrgPage = async (req, res) => {

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


module.exports = { getAllOrgs, getOrgByID, getOrgPage }