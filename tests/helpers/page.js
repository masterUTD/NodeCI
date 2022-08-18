const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory')
const userFactory = require('../factories/userFactory')

class CustomPage {
    static async build() { // static functions can be used without create an instance for example new CustomPage
        const browser = await puppeteer.launch({  // to lauch a instance of chronium
            headless: true,
            args: ['--no-sanbox'] // to decrease the amount that it takes to our tets run // in the travis ci virtual machine
        });

        const page = await browser.newPage() // create a new page or a new tab
        const customPage = new CustomPage(page); 

        return new Proxy(customPage, { 
            get: function(target, property){
                return  customPage[property] || browser[property] || page[property] 
               // primer busca en customPage despues en browser y despues en page 
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
    
        await this.page.goto('http://localhost:3000/blogs')//refesh the page // this takes some time to go to /blogs
    
        //the page load as soon as it can so we are pausing until the log out button is loaded correctly
    
        await this.page.waitFor('a[href="/auth/logout"]') // to wait for this logout button to be loaded correctly // or to show

    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML)


    }

};

module.exports = CustomPage;