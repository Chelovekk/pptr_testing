const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const { Telegraf } = require('telegraf');
require('dotenv').config();


const bot  = new Telegraf(process.env.TG_TOKEN)
bot.start((ctx) => {
    ctx.reply('Welcome')
})

const app = express();

(async () => {
    const browser = await puppeteer.launch({headless:false, executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});  
    console.log(await browser.version())
    
    const [ page ] = await browser.pages();
    page.goto('https://www1.oanda.com/lang/ru/currency/live-exchange-rates/')
    await page.waitForNavigation();

        setInterval( async()=>{
            let exRate  = await page.evaluate(async ()=>{
                return document.querySelector('#EUR_USD-b-int').textContent + document.querySelector('#EUR_USD-b-pip').textContent + document.querySelector('#EUR_USD-b-ette').textContent
            });
            bot.telegram.sendMessage(process.env.TG_CHANNEL_ID, exRate)
        },5000)
        
    
    // await browser.close()
})()

app.listen(3000, ()=>{
    console.log('started')
})