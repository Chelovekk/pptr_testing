const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const { Telegraf } = require('telegraf');
require('dotenv').config();


const bot  = new Telegraf(process.env.TG_TOKEN);
bot.start((ctx) => {
    ctx.reply('Welcome');
})

const app = express();

(async () => {
    const browser = await puppeteer.launch({ headless: false, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });  
    
    const [ page ] = await browser.pages();
    page.goto('https://www1.oanda.com/lang/ru/currency/live-exchange-rates/');
    await page.waitForNavigation();
    
    var tempExRate = 0;
    setInterval(async () => {
        const exRate  = await page.evaluate(async ()=>{
            const newExRate = document.querySelector('#EUR_USD-b-int').textContent + document.querySelector('#EUR_USD-b-pip').textContent + document.querySelector('#EUR_USD-b-ette').textContent;
                return newExRate;
        });
        if (exRate === tempExRate)return;
        else tempExRate = exRate;

        bot.telegram.sendMessage(process.env.TG_CHANNEL_ID, exRate);
    }, 5000)
    // await browser.close()
})()
app.listen(3000, ()=>{
    console.log('started');
})