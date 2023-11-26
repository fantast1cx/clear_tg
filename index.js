const axios = require('axios');

const { Telegraf, Markup, Telegram } = require('telegraf');
require('dotenv').config();
const bot = new Telegraf(process.env.BOT_TOKEN);

const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());
app.use(express.static(__dirname));
app.use(bodyParser.json());




app.get('/', (req, res) => {

    res.sendFile("index.html");

});

app.post('/get_invoice', async (req, res) => {

    let data = req.body;
    let tg_api_url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/createInvoiceLink`;

    const invoice = {
        chat_id: data.chat_id,
        provider_token: process.env.STRIPE_TOKEN,
        start_parameter: 'get_access',
        title: data.name,
        description: data.desc,
        currency: 'RUB',
        prices: [{ label: data.name, amount: 100 * data.price }], 
        payload: {
          unique_id: `${data.user_name}_${Number(new Date())}_${data.id}`,
          provider_token: process.env.STRIPE_TOKEN 
        }
    };

    axios.post(tg_api_url, JSON.stringify(invoice), { headers: { 'Content-Type': 'application/json' } })
    .then(response => res.send(response.data.result))
    .catch(err => console.log(err));

});

app.listen(port, () => console.log(`server started on ${port} port`));




bot.start(ctx => ctx.reply('Привет, все товары можешь посмотреть нажав на кнопку "Меню"'));

bot.use(Telegraf.log());

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));

bot.on('successful_payment', (ctx, next) => {

    console.log(ctx.update.message.successful_payment);

    const AppsScriptURL = 'https://script.google.com/macros/s/AKfycbyTTAbrds_iIrm03BUfaf7fF9wAccrHet3qg5TnXoUYNfZAZCrflYzb4hg5wJouJ6Su5w/exec';

    axios.post(AppsScriptURL, JSON.stringify(ctx.update.message.successful_payment.invoice_payload), { headers: { 'Content-Type': 'application/json' } });

    ctx.reply('Оплата прошла успешно');

});

bot.launch();