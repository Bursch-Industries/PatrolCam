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


        let sortCriteria;
        let orderCriteria
        let filterCriteria = {};
        let orgs;

         // Extract sorting criteria and filter criteria
         if (Object.keys(req.query).length > 2) {
            // First two parameters are page and limit, slice the rest for sorting
            const queryEntries = Object.entries(req.query).slice(2);
            for (const [key, value] of queryEntries) {
                if (key.startsWith('sort_')) { // Extract the column that is being toggled
                    sortCriteria = value; 
                } else if(key.startsWith('order_')){ // Extract the order in which to sort the column
                    orderCriteria = value;
                } else {
                    filterCriteria[key] = value; // Handle other filters
                }
            }
        }
        
        if (sortCriteria === 'numberOfUsers' || sortCriteria === 'numberOfCameras') {

            // Parse the sortCriteria to match an attribute in the Mongo table, of which to get the length of
            const arrayField = sortCriteria === 'numberOfUsers' ? 'users' : 'cameras';

            orgs = await org.aggregate([
                { $match: filterCriteria }, // Match filters
                { $addFields: { length: { $size: `$${arrayField}` } } }, // Add length field
                { $sort: { length: orderCriteria === 'asc' ? 1 : -1 } }, // Sort by length
                { $skip: skip },
                { $limit: limit }
            ]);
        } else if (orderCriteria && sortCriteria) {
            const sort = { [sortCriteria]: orderCriteria };
            orgs = await org.find(filterCriteria).sort(sort).skip(skip).limit(limit);
        } else {
            orgs = await org.find(filterCriteria).skip(skip).limit(limit);
        }
       
        
        const totalOrgs = await org.countDocuments();

        const totalPages = Math.ceil(totalOrgs / limit);

        res.json({
            page,
            totalPages,
            totalOrgs,
            orgs,
            filters: filterCriteria,
            sort: sortCriteria
        });

    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message });
    }


}


module.exports = { getAllOrgs, getOrgByID, getOrgPage }