const { text } = require( 'express' );
const Page = require('./helpers/page')

let page;

beforeEach(async () => {
    page = await Page.build()

    await page.goto('http://localhost:3000')
});

afterEach(async () => {
    await page.close() // aqui esta usando la instancia del browser de la proxy que creamos

});


describe('when logged in',  () => {
    beforeEach(async () => { // this beforeEach makes effect just what is inside the parent describe // this beforeEach is also available for the second describe
        await page.login()
        await page.click('a.btn-floating')

    })

    test(' can see blog create form', async () => {
      
        const label = await page.getContentsOf('form label')
    
        expect(label).toEqual('Blog Title')
    
    });

    describe('and using valid inputs', () => {
        beforeEach( async () => {
            await page.type('.title input', 'My Title')
            await page.type('.content input', 'My Content')
            await page.click('form button')

        })

        test('submitting takes user to review screen ', async () => {
            const text = await page.getContentsOf('h5')

            expect(text).toEqual('Please confirm your entries')

        })

        test('submitting then saving add blogs to index page', async () => {
           await page.click('button.green') // this takes some time so i have to waitFor
           await page.waitFor('.card') 

           const title = await page.getContentsOf('.card-title')
           const content = await page.getContentsOf('p')

           expect(title).toEqual('My Title')
           expect(content).toEqual('My Content')

        })

    });

    describe('and using invalid inputs',  () => {
        beforeEach(async () => {
            await page.click('form button')

        })

        test('the form shows an error message', async () => {
            const titleError = await page.getContentsOf('.title .red-text')
            const contentError = await page.getContentsOf('.content .red-text')

            expect(titleError).toEqual('You must provide a value')
            expect(contentError).toEqual('You must provide a value')

        })

    })

})


describe('User is not logged in ', () => {
    test('user cannot create a blog post', async () => {

       const result = await page.evaluate(() => {

                return fetch('/api/blogs', {
                    method: 'POST',
                    credentials: 'same-origin',  // to send the cookies back to the server or api,,,, i think
                    headers : {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({title: 'My Title', content: 'My Content'})
                }).then(res =>  res.json())

            }

        );



            expect(result).toEqual({error: 'You must log in!'})

    });

    test('user cannot get a list of posts', async () => {

        const result = await page.evaluate(() => {

                return fetch('/api/blogs', {
                    method: 'GET',
                    credentials: 'same-origin',  // to send the cookies back to the server or api,,,, i think
                    headers : {
                        'Content-Type': 'application/json'
                    }
                }).then(res =>  res.json())

            }

        );

        expect(result).toEqual({error: 'You must log in!'})

    });

});