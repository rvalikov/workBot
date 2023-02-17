import express from 'express';
import TelegramBot from 'node-telegram-bot-api';
import fs from 'fs';
import { readExcel } from './telegram-excel-bot.js';
import { PORT, TOKEN } from './config.js';
import { KeyboardAgree, MakeKeyboard } from './keyboard.js';

const bot = new TelegramBot(TOKEN, { polling: true });
const app = express();
const keyboard = MakeKeyboard();
const keyboardAgree = KeyboardAgree();
let employee = {}
let count = 1

// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  count = 1;
  employee = {};
  console.log("countbegin", count)
  const chatId = msg.chat.id;
  const chatName = msg.chat.first_name;
  

  bot.sendMessage(chatId, `Привет ${chatName}!  Познакомимся? `, {
    reply_markup: {
      inline_keyboard: keyboard
    }
  });
});

// Обработчик нажатия кнопок
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;

  switch (query.data) 
  {
    case 'yes':
      bot.sendMessage(chatId, `Загрузка согласия`);
      fs.readFile('./Согласие по ФЗ-152.pdf', (err, file) => {
        bot.sendDocument(chatId, file, {
          caption: 'Согласие'
        })
          .then(() => {
            bot.sendMessage(chatId, `Подпиши согласие`, {
              reply_markup: {
                inline_keyboard: keyboardAgree
              }
            });
          });
      });
      break;

    case 'yesAgree':
      bot.sendMessage(chatId, `Согласие подписано. введите имя`);
      
      // Обработчик введенных данных
      bot.on('message', (msg) => {
        if (count == 1) {
          employee.firstName = msg.text;
          count++;
          bot.sendMessage(chatId, 'Введите фамилию сотрудника:');
        } else if (count == 2) {
          employee.lastName = msg.text;
          count++;
          bot.sendMessage(chatId, 'Введите отдел сотрудника:');
        } else if (count == 3) {
          employee.department = msg.text;
          count++;
          bot.sendMessage(chatId, 'Введите телефон сотрудника:');
        } else if (count == 4) {
          employee.phone = msg.text;
          bot.sendMessage(chatId, `Вы ввели: Имя: ${employee.firstName}, Фамилия: ${employee.lastName}, Отдел: ${employee.department}, Телефон: ${employee.phone}`);
          
        }
      
    })

break;
  
                   
                 
                  
                
                   
     
             case "noAgree":{
                bot.sendMessage(chatId, `К сожалению, без подписания Согласия мы не можем взаимодействовать`)
                   break     
             }
  }
})
   
// bot.launch()
app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))