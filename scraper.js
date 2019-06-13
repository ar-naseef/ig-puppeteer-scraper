const puppeteer = require('puppeteer');
const fs = require('fs');
const delay = require('delay')

let accounts = fs.readFileSync('./data/accounts.txt');
let comments = fs.readFileSync('./data/comments.txt');

let acc = [];

// replace the below line with the link of the post
let post = 'https://www.instagram.com/p/BrqGJgslVYD/';

// delay between each comment
let delatBtwEachComment = 17000;

let cmnt = [];

accounts.toString().split('\n').forEach(account => {
    acc.push({
        email: account.split(':')[0],
        pass: account.split(':')[1]
    })
});

comments.toString().split('\n').forEach(c => {
    cmnt.push(c)
})

console.log("starting");

(async () => {
    
    for (let i=0; i<acc.length; i++) {
        const browser = await puppeteer.launch({headless: false});

        const page = await browser.newPage();
        console.log("starting scraper..", i);
        await page.goto('https://www.instagram.com/accounts/login/');
        console.log("visiting instagram.com", i);
        await page.waitFor('input._2hvTZ.pexuQ.zyHYP');
        
        // logging in
        console.log("logging In", i);
        // await page.waitFor(500)
        // await page.type('[name="username"]', acc[i].email, { delay: 27 })

        // await page.type('[name="password"]', acc[i].pass)
        // await page.click('[type="submit"]');
        await page.waitFor('input[name=username]', { visible: true })
        await delay(300)
        await page.type('input[name=username]', acc[i].email, { delay: 27 })

        await delay(520)
        await page.type('input[name=password]', acc[i].pass, { delay: 42 })

        await delay(700)
        const [ signup ] = await page.$x('//button[contains(.,"Log in")]');

        await Promise.all([
            page.waitForNavigation(),
            signup.click({ delay: 30 })
        ])

    
        await page.waitFor('body > div:nth-child(12) > div > div > div');
        console.log("login successfull", i);
    
        await page.waitFor('body > div:nth-child(12) > div > div > div')
        await page.goto(post);
        await page.waitFor('#react-root > section > main > div > div > article > div > section > div > form > textarea');

        await page.waitFor(3000);
        
        for (let j=0; j<3; j++) {
            console.log("commenting..", j+1)
            await page.type('[placeholder="Add a comment…"]', cmnt[i*3+j])
            await page.keyboard.press('Enter');
            await page.waitFor(delatBtwEachComment);
        }

        await page.click('#react-root > section > nav > div > div > div > div > div > div:nth-child(3) > a > span');

        await page.waitFor('#react-root > section > main > div > header > section > div > div > button > span');
        await page.click('#react-root > section > main > div > header > section > div > div > button > span');
        await page.waitFor('body > div > div > div > div > div > button:nth-child(6)');
        await page.click('body > div > div > div > div > div > button:nth-child(6)');

        // console.log(logenInName);
        await page.waitFor(500);
           
        await browser.close();
    }

})();
