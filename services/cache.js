const mongoose = require('mongoose');
const redis = require('redis');
const keys = require('../config/keys');

const client = redis.createClient({ url: keys.redisUrl })
client.on('error', (err) => console.log('Redis Client Error', err));


  async function connectRedis() {
    await client.connect()

  }

   connectRedis()  // connectando redis
   .then(() => console.log('redis connected'))
   .catch((err) => console.log('Hay un error con redis', err))

const exec = mongoose.Query.prototype.exec;


// mongoose.Query.prototype.cache // esta instancia cache la cree yo 
mongoose.Query.prototype.cache = function (options = {} ) { // esta instancia hace parte de la misma clase Query de mongoose // creada por mi
  this.usarCache = true; // por ende puedo usar esta propiedad en la instancia exec // creada por mi
  this.hashKey = JSON.stringify(options.key || ''); //creada por mi
  
  return this; // para que esta instancia o funcion se chainable  for example User.find(user: 838747474).limit(1).cache() // the last one
}

// this.query()  1: request from our react app the current user query 2: the current passport.deserializeUser creo 3: the actual blogs fetch query

mongoose.Query.prototype.exec = async function() { // modificando la funcion exec de mongoose for every find query
     //console.log('el console.log de this.query',this.getQuery())

     if(!this.usarCache) { // puedo usar esta propiedad por que es la misma instancia
        return exec.apply(this, arguments) // this se refiere a esta query y arguments si hay argumentos en la query
     }

   const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {// Object.assign clona o copia otros objectos al primer parametro que es un objecto vacio
        collection: this.mongooseCollection.name // le estamos clonando el this.getQuery y collection que va a ser igual a thus.mongooseCollection.name
     }));
     //see if we have a value for 'key' in redis
     const cacheValue = await client.hGet(this.hashKey, key)

     
     //if we do, return that // si hay informacion en redis cache
     if(cacheValue) {
        console.log('caching from redis')
        const doc = (JSON.parse(cacheValue) ) // this : is the reference of the query that we are currently executing
        // lo parseo por que esto viene en formato json 
        return Array.isArray(doc) // compruebo si es un array
        ?  doc.map(d => new this.model(d))
        :  new this.model(doc) //
        // lo convierto a un mongoose document de nuevo por que mi app esta esperando ese tipo de documento
    
     }

     //otherwise, issue (send)the  query and store the result in redis

    const result = await exec.apply(this, arguments) // ejecutando la funcion originaria exec de mongoose de hacer query // esto me da un mongoose document , it is not a simple object
    await client.hSet(this.hashKey, key, JSON.stringify(result), 'EX', 10) // lo convertimos a string por que redis solo acepta carateres y numeros
    console.log('returning from database')
    return result; // aqui si retirnamos el resultado normal (el mongoose document ) por que el servidor y el cliente si entienden este tipo de documento de mongodb (exec)
};

module.exports = {
  clearHash(hashKey) { // un funcion para limpiar o eliminar la cache 
      client.del(JSON.stringify(hashKey)) // to make sure it is an string
      console.log('redis cache deleted')

  }

};
























///////////////////////////////////////////////////  BEFORE  ///////////////////////////////////////////////////////////////////////////

// const exec = mongoose.Query.prototype.exec;

// mongoose.Query.prototype.cache = function () { // esta instancia hace parte de la misma clase Query de mongoose
//   this.usarCache = true; // por ende puedo usar esta propiedad en la instancia exec
//   return this; // para que esta instancia o funcion se chainable  for example User.find(user: 838747474).limit(1).cache() // the last one
// }

// // this.query()  1: request from our react app the current user query 2: the current passport.deserializeUser creo 3: the actual blogs fetch query

// mongoose.Query.prototype.exec = async function() { // modificando la funcion exec de mongoose for every find query
//      //console.log('el console.log de this.query',this.getQuery())

//      if(!this.usarCache) {
//         return exec.apply(this, arguments) // this se refiere a esta query y arguments si hay argumentos en la query
//      }

//    const key = JSON.stringify(
//     Object.assign({}, this.getQuery(), {// Object.assign clona o copia otros objectos al primer parametro que es un objecto vacio
//         collection: this.mongooseCollection.name // le estamos clonando el this.getQuery y collection que va a ser igual a thus.mongooseCollection.name
//      }));
//      //see if we have a value for 'key' in redis
//      const cacheValue = await client.get(key)

     
//      //if we do, return that // si hay informacion en redis cache
//      if(cacheValue) {
//         console.log(cacheValue)
//         const doc = (JSON.parse(cacheValue) ) // this : is the reference of the query that we are currently executing
//         // lo parseo por que esto viene en formato json 
//         return Array.isArray(doc) // compruebo si es un array
//         ?  doc.map(d => new this.model(d))
//         :  new this.model(doc) //
//         // lo convierto a un mongoose document de nuevo por que mi app esta esperando ese tipo de documento
    
//      }

//      //otherwise, issue (send)the  query and store the result in redis

//     const result = await exec.apply(this, arguments) // ejecutando la funcion originaria exec de mongoose de hacer query // esto me da un mongoose document , it is not a simple object
//     await client.set(key, JSON.stringify(result), 'EX', 10) // lo convertimos a string por que redis solo acepta carateres y numeros
//     console.log('returning from database')
//     return result; // aqui si retirnamos el resultado normal (el mongoose document ) por que el servidor y el cliente si entienden este tipo de documento de mongodb (exec)
// };




