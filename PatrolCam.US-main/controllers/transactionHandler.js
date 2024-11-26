const mongoose = require('mongoose')

/**
 * Handles MongoDB transactions dynamically.
 * 
 * @param {Function} transactionCallBack - The function containing transactional operations.
 * @returns {Promise<any>} - The result of the transaction callback.
 * @throws {Error} - If the transaction fails
 */

async function withTransaction(transactionalCallback){
    const session = await mongoose.startSession()
    try{
        session.startTransaction() //Start the transaction

        const result = await transactionalCallback(session) //Execute the callback with the session

        await session.commitTransaction() //Commit the transaction if successful

        return result
    } catch (error) {
        await session.abortTransaction() //Rollback on error
        console.log('TRANSACTION ERROR: ' + error.message);
        throw new Error(`Transaction failed: ${error.message}`)
    } finally {
        session.endSession() //Close up session
    }
}

module.exports = { withTransaction }