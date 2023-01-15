const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory')
const userFactory = require('../factories/userFactory')

class CustomPage {
    static async build() { // static functions can be used without create an instance for example new CustomPage
        const browser = await puppeteer.launch({  // to lauch a instance of chronium
            headless: false
        });

        const page = await browser.newPage() // create a new page or a new tab
        const customPage = new CustomPage(page); 

        return new Proxy(customPage, { 
            get: function(target, property){
                return  customPage[property] || browser[property] || page[property] 
               // primerò busca en customPage despues en browser y despues en page 
               //browser y page tiene una funcion llamada close pero primero la va a encontrar en el browser
              
            }
        })
    }

    constructor(page ) {
        this.page = page;
    }

    async login() {
        const user = await userFactory()
        const { session, sig } = sessionFactory(user)
    
       
        await this.page.setCookie({ name:'session', value: session }) // setting the cookies
        await this.page.setCookie({ name:'session.sig', value: sig })
    
        await this.page.goto('localhost:3000/blogs')//refesh the page // this takes some time to go to /blogs
    
        //the page load as soon as it can so we are pausing until the log out button is loaded correctly
    
        await this.page.waitFor('a[href="/auth/logout"]') // to wait for this logout button to be loaded correctly // or to show

    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML)


    }

    get(path) {
        return this.page.evaluate( (_path) => { // got passed by the second argument of the function ,, podria nombrarla path  pero preferi nombrarla asi

                return fetch(_path, {
                    method: 'GET',
                    credentials: 'same-origin',  // to send the cookies back to the server or api,,,, i think
                    headers : {
                        'Content-Type': 'application/json'
                    }
                }).then(res =>  res.json())

            }, path); // this second argument get passed to the function page.evaluate as a parameter


    }

    post(path, data) {

        return this.page.evaluate( (_path, _data) => {

                return fetch(_path, {
                    method: 'POST',
                    credentials: 'same-origin',  // to send the cookies back to the server or api,,,, i think
                    headers : {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(_data)
                }).then(res =>  res.json())

            },path, data);




    }

    execRequests(actions) {
        return Promise.all(// array of promises // to wait for all of them, to be resolve
            actions.map(({ method, path, data }) =>  {
            return this[method](path, data) // aqui esta ivocando ya sea la funcion get o la post // y le paso los argumentos ,,, 
            // el argumento data solo va a ser para la funcion post que toma dos argumentos, la funcion get solo toma el path
            // () to execute the funtion or functions cause is an array of promises
        })
        
        );

    };

};

module.exports = CustomPage;