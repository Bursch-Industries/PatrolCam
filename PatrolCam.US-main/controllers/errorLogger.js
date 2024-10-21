const errorLog = require('../model/errorLog'); 

async function logError(req, {
    level,
    message,
    source,
    userId,
    code,
    meta,
    session = null
}) 

{

    if(req.session.user){
        console.log('user is logged in when sending an email')
        userId = req.session.user
    }

    try{
        const log = new errorLog({
            level,
            message,
            source,
            userId,
            code,
            meta
        })

        await log.save({ session })
    } catch (error){
        throw new Error(`Error occured while logging ${action} on ${collectionName}: ${error.message}`)
    }
}



module.exports = { logError }