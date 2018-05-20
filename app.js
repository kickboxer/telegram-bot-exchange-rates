const TelegramBot = require('node-telegram-bot-api');
const request = require('request');

const token = '574699912:AAGP-aqQaTFLoIXqFpwh5YS3tq88zASkc50';

const bot = new TelegramBot(token, {polling: true});

bot.onText(/\/rates/, (msg) => {

  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Выберите валюту', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '€ - EUR',
            callback_data: 'EUR',
          },
          {
            text: '$ - USD',
            callback_data: 'USD',
          },
          {
            text: '₴ - UAH',
            callback_data: 'UAH',
          },
          {
            text: '₽ - RUR',
            callback_data: 'RUB',
          },
        ],
      ],
    },
  });

});

bot.on('callback_query', query => {

  const courses = [
    {
      name: 'UAH',
      id: 290,
    },
    {
      name: 'USD',
      id: 145,
    },
    {
      name: 'EUR',
      id: 292,
    },
    {
      name: 'RUB',
      id: 298,
    },
  ];
  const flags = {
    'UAH': '🇺🇦',
    'USD': '🇺🇸',
    'EUR': '🇪🇺',
    'RUB': '🇷🇺',
    'BYN': '🇧🇾',
  };
  const cur = courses.filter(course => course.name === query.data)[0];
  const id = query.message.chat.id;

  request(`http://www.nbrb.by/API/ExRates/Rates/${cur.id}?Periodicity=0`, (error, response, body) => {
    const result = JSON.parse(body);
    const  md = `
      *${flags['BYN']} BYN ⇄ ${flags[result.Cur_Abbreviation]} ${result.Cur_Abbreviation}*

      _1 BYN  ~ ${Math.pow((result.Cur_Scale / result.Cur_OfficialRate).toFixed(4), 1)} ${result.Cur_Abbreviation}_
      _1 ${result.Cur_Abbreviation}  ~ ${Math.pow((result.Cur_OfficialRate / result.Cur_Scale).toFixed(4), 1)} BYN_
    `;
    bot.sendMessage(id, md, {parse_mode: 'MarkDown'});

  });
});

bot.on('message', (msg) => {

  const chatId = msg.chat.id;

  if (msg.text !== '/rates') {
    bot.sendMessage(chatId, 'Напишите в чате /rates, чтобы узнать курсы валют');
  }
});
