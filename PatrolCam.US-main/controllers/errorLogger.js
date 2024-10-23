const errorLog = require('../model/errorLog'); 

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

    if(req.session && req.session.user){
        userId = req.session.user.id
    }

    try{
        const log = new errorLog({
            level,
            desc,
            source,
            userId,
            code,
            meta
        })

        await log.save({session})
    } catch (error){
        throw new Error(`Error occured while logging Error: ${error.message}`)
    }
}



module.exports = { logError }