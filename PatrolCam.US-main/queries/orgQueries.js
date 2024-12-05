const org = require("../model/Organization");
const  { logActivity } = require('../controllers/logger'); //Used for logging activities
const { logError } = require('../controllers/errorLogger'); //Used for logging errors
const { withTransaction } = require('../controllers/transactionHandler') //Handles Database transaction


// Returns entire Organization structure based on ID sent from front-end fetch call
const getOrgByID = async (req, res) => {
    
    const orgId = req.params.id; // Get ID from URI

    try {
        const oneOrg = await org.findById(orgId); 
        res.status(200).json(oneOrg)
    } catch (error) {
        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to retrieve organization details',
                source: 'orgQueries - getOrgByID',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });
        res.status(500).json({ message: error.message });
    }
}

// Returns entire camera array of an organization ID that is specified in fetch param
const getOrgCamData = async (req, res) => {

    const orgId = req.params.id; // Get organization ID from URL

    try {
        const targetOrg = await org.findById(orgId).populate({ // Retrieves camera information from the cameras table
            path: 'cameras'
        }); 
        
        if(targetOrg.cameras == '') { // Organization is found and they have no cameras
            return res.sendStatus(204)
        } else {
            return res.status(200).json(targetOrg.cameras)
        }
        
    } catch (error) {
        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'ERROR',
                desc: 'Failed to retrieve camera details for organization',
                source: 'orgQueries - getOrgCamData',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });
        return res.status(500).json({ message: error.message });
    }
}

// Returns all user information of an organization based organization ID 
const getOrgUserData = async (req, res) => {
    
    let orgId;

    if(req.params.id){
        orgId = req.params.id; // Get target organization from URL (used for Account Admin to view specific organization)
    } else if(req.session.org && req.session.org.id) {
        orgId = req.session.org.id; // Set target organization based on user's current organization (used for Admin)
    } else {
        return res.sendStatus(401); // Permission denial
    }

    try {
        const orgUserData = await org.findById(orgId) // Retrieve user information from users table
            .populate({
                path: "users",
            })

        const users = orgUserData.users;

        if(users == '') { // If organization is found and has no users
            return res.sendStatus(204)
        } else {
            return res.status(200).json(users);
        }
        
    } catch (error) {
        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'TRACE',
                desc: 'Failed to retrieve user details for organization',
                source: 'orgQueries - getOrgUserData',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });
        return res.status(500).json({ message: error.message });
    }
}

// Finds the timestamp of the last login of all users in an organization
const getOrgLoginData = async (req, res) => {
    
    let orgId;

    if(req.params.id){
        orgId = req.params.id; // Get target organization from URL (used for Account Admin to view specific organization)
    } else if(req.session.org && req.session.org.id) {
        orgId = req.session.org.id; // Set target organization based on user's current organization (used for Admin)
    } else {
        return res.sendStatus(401); // Permission denial
    }
    
    try {
        const orgUserData = await org.findById(orgId)
            .populate({
                path: "users",
                options: { sort: { lastLoggedIn: -1 } } // Sort so most recently logged in will be displayed at the top of the list
            })

        const users = orgUserData.users;

        if(users == '') { // If organization is found and has no users
            return res.sendStatus(204)
        } else {
            return res.status(200).json(users);
        }
        
    } catch (error) {
        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'TRACE',
                desc: 'Failed to retrieve login details for organization',
                source: 'orgQueries - getOrgLoginData',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });
        return res.status(500).json({ message: error.message });
    }
}



// Query for Account Admin view of all organizations
const getOrgPage = async (req, res) => {
    
    try {
        const page = parseInt(req.query.page) || 1; // Which page is being requested, default to 1
        const limit = parseInt(req.query.limit) || 10; // How many results per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many results to skip in order to send data for the above page

        let sortCriteria;
        let orderCriteria
        let filterCriteria = {};
        const advFilterCriteria = {};
        let orgs;

         // Extract sorting criteria and filter criteria
         if (Object.keys(req.query).length > 2) {
            const queryEntries = Object.entries(req.query).slice(2); // First two parameters are always page and limit, slice the rest for sorting
            for (const [key, value] of queryEntries) {
                if (key.startsWith('sort_')) { // Extract the column that is being toggled for sorting
                    sortCriteria = value; 
                } else if(key.startsWith('order_')){ // Extract the order in which to sort the column
                    orderCriteria = value;
                } else if(key.startsWith('minVal_')) { // Extract minimum value of filter search
                    advFilterCriteria.$gte = parseInt(req.query.minVal_);
                } else if(key.startsWith('maxVal_')) { // Extract maximum value of filter search
                    advFilterCriteria.$lte = parseInt(req.query.maxVal_);
                } else {
                    filterCriteria[key] = { $regex: value, $options: 'i' }; // Handle other filters (pretty much the search bar w/ partial match and case insensitive)
                }
            }
        }
        
        if(Object.keys(advFilterCriteria).length > 0) { // Check if the Filter form is being used

            const arrayField = 'users';
            const advFilterMatch = Object.keys(advFilterCriteria).length > 0 ? { length: advFilterCriteria } : {};

            orgs = await org.aggregate([
                { $match: filterCriteria }, // Match filters
                { $addFields: { length: { $size: `$${arrayField}` } } }, // Add length field to the result
                { $match: advFilterMatch},
                { $sort: { length: orderCriteria === 'asc' ? 1 : -1 } }, // Sort by length
                { $skip: skip },
                { $limit: limit }
            ]);
        } else if (sortCriteria === 'numberOfUsers') { 

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

        } else { // Default to sorting by organization name in alphabetical order
            orgs = await org.find(filterCriteria).sort({organizationName: 'asc'}).skip(skip).limit(limit);
        }
    
        const totalOrgs = await org.countDocuments(filterCriteria); // Get the total number of organizations returned after the filters are applied

        const totalPages = Math.ceil(totalOrgs / limit); // Calculate the number of pages of results

        res.json({
            page,
            totalPages,
            totalOrgs,
            orgs,
            filters: filterCriteria,
            sort: sortCriteria
        });

    } catch (error) {
        await withTransaction(async (session) => {  
            await logError(req, {
                level: 'TRACE',
                desc: 'Failed to retrieve organization data for orgList',
                source: 'orgQueries - getOrgPage',
                userId: 'System',
                code: '500',
                meta: { message: error.message, stack: error.stack },
                session
            });
        });
        res.status(500).json({ message: error.message });
    }


}


module.exports = { getOrgByID, getOrgCamData, getOrgUserData, getOrgPage, getOrgLoginData }