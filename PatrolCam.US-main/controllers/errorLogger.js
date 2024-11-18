const errorLog = require('../model/errorLog'); 

/**
 * Logs error details to the database dynamically.
 * 
 * @param {Object} req - The request object, used to extract the session and user information if available.
 * @param {Object} options - An object containing error log details.
 * @param {string} options.level - The severity level of the error.
 * @param {string} options.desc - A description of the error.
 * @param {string} options.source - The source of the error (e.g., a module or component name).
 * @param {string} options.userId - The ID of the user associated with the error. If a user is logged in, this will be automatically assigned from the session.
 * @param {string} options.code - A custom error code for categorizing the error.
 * @param {Object} options.meta - Additional metadata related to the error.
 * @param {Object} options.session - The session object used for database transactions.
 * @returns {Promise<void>} - Resolves if the error is successfully logged; otherwise, throws an error.
 * @throws {Error} - If an error occurs while saving the error log.
 */
async function logError(req, {
    level,
    desc,
    source,
    userId,
    code,
    meta, 
    session
}) 

{
    // Check if session and user information are available, and use the session user ID if provided.
    if(req.session && req.session.user){
        userId = req.session.user.id
    }

    try{
        // Create a new error log document using the provided details.
        const log = new errorLog({
            level,
            desc,
            source,
            userId,
            code,
            meta
        })

        // Save the error log to the database, using the provided session for the transaction.
        await log.save({session})
    } catch (error){
        
        // Throw an error if the logging operation fails.
        throw new Error(`Error occured while logging Error: ${error.message}`)
    }
}



module.exports = { logError }