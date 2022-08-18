const { clearHash } = require('../services/cache')

module.exports = async ( req, res, next ) => { 
    await next() // para que este middleware se ejecute despues o al final cuando toda la ruta haya hecho su trabajo

    clearHash(req.user.id)

}