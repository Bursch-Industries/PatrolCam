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

// Returns entire Organization structure based on ID sent in fetch call
const getOrgByID = async (req, res) => {

    console.log('entering orgQueries/getOrgByID')
    
    const orgId = req.params.id;

    try {
        const oneOrg = await org.findById(orgId); 
        res.status(200).json(oneOrg)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Returns entire camera array of an organization ID that is specified in fetch param
const getOrgCamData = async (req, res) => {
    
    console.log('entering orgQueries/getOrgCamData')

    const orgId = req.params.id;

    if(orgId) {
        console.log('orgId found for Cam Data: ' + orgId);
    }

    try {
        const oneOrg = await org.findById(orgId); 
        const cameras = oneOrg.cameras;

        if(cameras == '') {
            console.log('No camera data for this organization');
            return res.sendStatus(204)
        } else {
            console.log('cameras found: ' + cameras);
            return res.status(200).json(cameras)
        }
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

// Returns entire user array of an organization ID that is specified in fetch param
const getOrgUserData = async (req, res) => {
    
    console.log('entering orgQueries/getOrgUserData')
    let orgId;
    const fields =[];

    if(req.params.id){
        console.log('req.params.id found')
        orgId = req.params.id;
    } else if( req.session.org && req.session.org.id) {
        console.log('req.session.org.id found')
        orgId = req.session.org.id;
    } else {
        return res.sendStatus(401);
    }
    
    if(orgId) {
        console.log('orgId found for User Data: ' + orgId);
    }

    try {
        const fieldSelection = fields.join(' ')
        const orgUserData = await org.findById(orgId)
            .populate({
                path: "users",
                select: fieldSelection
            })
            .lean()
            .exec()

        console.log('query completed for org users')
        const users = orgUserData.users;

        if(users == '') {
            console.log('No user data for this organization');
            return res.sendStatus(204)
        } else {
            console.log('users found: ' + users.length);
            return res.status(200).json(users);
        }
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


const getOrgPage = async (req, res) => {

    console.log('entering getOrgPage')
    
    try {
        // If no page in URL, default to 1
        const page = parseInt(req.query.page) || 1;
        // If no limit in URL, default to 2
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        console.log('Query Sent: ' + JSON.stringify(req.query))
        let sortCriteria;
        let orderCriteria
        let filterCriteria = {};
        const advFilterCriteria = {};
        let orgs;

         // Extract sorting criteria and filter criteria
         if (Object.keys(req.query).length > 2) {
            // First two parameters are page and limit, slice the rest for sorting
            const queryEntries = Object.entries(req.query).slice(2);
            for (const [key, value] of queryEntries) {
                if (key.startsWith('sort_')) { // Extract the column that is being toggled
                    console.log('sort criteria found')
                    sortCriteria = value; 
                    console.log(JSON.stringify(sortCriteria))
                } else if(key.startsWith('order_')){ // Extract the order in which to sort the column
                    orderCriteria = value;
                } else if(key.startsWith('minVal_')) {
                    advFilterCriteria.$gte = parseInt(req.query.minVal_);
                } else if(key.startsWith('maxVal_')) {
                    advFilterCriteria.$lte = parseInt(req.query.maxVal_);
                } else {
                    filterCriteria[key] = { $regex: value }; // Handle other filters
                }
            }
        }
        
        if(Object.keys(advFilterCriteria).length > 0) {

            console.log('Advanced Filters Found')

            const arrayField = sortCriteria === 'numberOfUsers' ? 'users' : 'cameras';
            const advFilterMatch = Object.keys(advFilterCriteria).length > 0 ? { length: advFilterCriteria } : {};

            console.log('filterCriteria: ' + JSON.stringify(filterCriteria));
            console.log('advFilterMatch: ' + JSON.stringify(advFilterMatch))


            orgs = await org.aggregate([
                { $match: filterCriteria }, // Match filters
                { $addFields: { length: { $size: `$${arrayField}` } } }, // Add length field
                { $match: advFilterMatch},
                { $sort: { length: orderCriteria === 'asc' ? 1 : -1 } }, // Sort by length
                { $skip: skip },
                { $limit: limit }
            ]);
        } else if (sortCriteria === 'numberOfUsers') {

            console.log('Sort and Order w/o Advanced Filters Found')
            console.log('filterCriteria: ' + JSON.stringify(filterCriteria));

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

            console.log('both sort and order criteria found')
            const sort = { [sortCriteria]: orderCriteria };
            console.log('filterCriteria: ' + JSON.stringify(filterCriteria))
            console.log('sort param: ' + JSON.stringify(sort))
            orgs = await org.find(filterCriteria).sort(sort).skip(skip).limit(limit);

        } else {

            console.log('no order criteria found')
            orgs = await org.find(filterCriteria).sort({organizationName: 'asc'}).skip(skip).limit(limit);
        }
    
        const totalOrgs = await org.countDocuments(filterCriteria);

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


module.exports = { getAllOrgs, getOrgByID, getOrgCamData, getOrgUserData, getOrgPage }