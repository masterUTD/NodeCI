const Buffer = require('safe-buffer').Buffer
const Keygrip = require('keygrip')
const keys = require('../../config/keys')
const peygrip = new Keygrip([keys.cookieKey]) // aqui deberia ponerle a la constante keygrip en vez de peygrip

module.exports = (user) => {

    const sessionObject = {
        passport: { 
            user: user._id.toString() // to convert to  string cause mongodb userid is not actually a string is an javascript object
        }
    };

    const session = Buffer.from(JSON.stringify(sessionObject)).toString('base64')
    // to turn the sessionObject into a base64 string


    const sig = peygrip.sign('session=' + session) //getting the seesion.sig
    
    return { session: session, sig: sig }

}