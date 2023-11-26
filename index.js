// ***** TG BOT *****

const telegram_api = require('node-telegram-bot-api');
const token = '6329876475:AAF-tHAts_Hbw2StXJ-hQ18t4R_eP6D9T1A';
const bot = new telegram_api(token, {polling: true});

// ***** TG BOT *****



// ***** GOOGLE SHEETS *****

const { google } = require("googleapis");

const credentials = "./google_credit.json";
const SPREADSHEET_ID = "1-gvZ_W9PhSgmIT-qlaDQlzi_fOZC1F6694Qa9Ri9FVU";

const auth = new google.auth.GoogleAuth({
  keyFile: credentials,
  scopes: "https://www.googleapis.com/auth/spreadsheets",


});

// ***** GOOGLE SHEETS *****



const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
app.use(cors());
app.use(express.static(__dirname));


app.get('/', (req, res) => {

    res.sendFile("index.html");

});

app.get('/google', async (req, res) => {

    const data = await get_data();

    res.json(data);

});


app.listen(port, () => console.log(`server started on ${port} port`));


async function get_data() {

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const getRows = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Sheet!A:D'
    });

    return getRows.data.values;

}

async function set_data() {

    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Orders!A:B',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [
                [1, 'test_1'],
                [2, 'test_2']
            ]
        }
    });

}






















// buttons.js -> module.exports -> objects
// const {btn_0, btn_1} = require('./buttons');

// // добовляет вкладку "Меню" в которой перечисленны команды
// bot.setMyCommands([
//     {command: '/start', description: 'start function'},
//     {command: '/test', description: 'start function'}
// ]);

// const buttons = {
//     reply_markup: JSON.stringify({
//         inline_keyboard: [
//             [{text: 1, callback_data: '1'}, {text: 2, callback_data: '2'}]
//         ]
//     })
// };

// bot.on('message', async msg => {

//     const text = msg.text;
//     const chat_id = msg.chat.id;

//     // sendMessage ( chatID, message, form )

//     if (text === '/info') return await bot.sendMessage(chat_id, 'some info');

//     if (text === '/test') return await button_test(chat_id);

// });

// // buttons callback
// bot.on('callback_query', async msg => {

//     const data = msg.data;
//     const chat_id = msg.message.chat.id;

//     bot.sendMessage(chat_id, data);

//     console.log(msg);

// });

// async function button_test(chat_id) {

//     bot.sendMessage(chat_id, 'buttons', buttons);

// }

