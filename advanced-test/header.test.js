const Page = require('./helpers/page')

let page; // to be accesible in my entire file

beforeEach( async () => {// this code will be executed automatically another test is going to run
    page = await Page.build() 
    
     
    await page.goto('localhost:3000') // navigate to our app

});

afterEach( async () => { // this code will be executed after another test is going to run
     await page.close() // close the chronium instance

})

test('the header has the correct text', async () => {
   
    const text = await page.getContentsOf('a.brand-logo')

    expect(text).toEqual('Blogster')

});

test('clicking login start oauth flow', async () => {
    await page.click('.right a'); // when clicking on this dom element ( login )  

    const url = page.url()

    expect(url).toMatch(/accounts\.google\.com/) // make sure if the url matches with the regex we wrote out

});

test('when signed in shows  logout button ', async () => { // test.only to just run this test
    await page.login()

   const text =  await page.$eval('a[href= "/auth/logout"]', el => el.innerHTML)


   expect(text).toEqual('Logout')

})