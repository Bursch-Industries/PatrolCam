const org = require("../model/Organization");
var ObjectId = require('mongodb').ObjectId;

const getAllOrgs = async (req, res) => {
    

    try {
        const allOrgs = await org.find({}); 
        res.status(200).json(allOrgs)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getOrgByID = async (req, res) => {
    
    const orgID = req.params.id;
    const o_id = new ObjectId(orgID);

    try {
        const oneOrg = await org.find({"_id" : o_id}); 
        res.status(200).json(oneOrg)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOrgPage = async (req, res) => {

    
    try {
        // If no page in URL, default to 1
        const page = parseInt(req.query.page) || 1;
        // If no limit in URL, default to 2
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        let sortCriteria = {};
        let orgs; 

        // skip and page should always be first two params. If more than 2 params are sent, slice the first two off to act as sort() arguments
        if(Object.keys(req.query).length > 2) {
            sortCriteria = Object.fromEntries(Object.entries(req.query).slice(2))
        }
       
        // If there are arguments for sort(), use dynamic query, else default to sending only skip and page
        if(Object.keys(sortCriteria).length > 0){
            orgs = await org.find().sort(sortCriteria).skip(skip).limit(limit);
            
        } else {
            orgs = await org.find().sort('asc').skip(skip).limit(limit);
        }
        const totalOrgs = await org.countDocuments();

        const totalPages = Math.ceil(totalOrgs / limit);

        res.json({
            page, 
            totalPages, 
            totalOrgs,
            orgs
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }


}


module.exports = { getAllOrgs, getOrgByID, getOrgPage }