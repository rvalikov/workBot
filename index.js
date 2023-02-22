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
const adminChatId=590783190
// Обработчик команды /start
bot.onText(/\/start/, (msg) => {
  count = 1;
  employee = {};
  console.log("countbegin", count)
  const chatId = msg.chat.id;
  
  console.log("chattbegin", msg.chat)

  bot.sendMessage(chatId, `Привет ${msg.chat.first_name} ${msg.chat.last_name}!  Познакомимся? `, {
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
        if (err) {
          bot.sendMessage(chatId, `Произошла ошибка при чтении файла: ${err.message}`);
          return;
        }
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

      case 'no':
        bot.sendMessage(chatId, `До встречи! `)
        bot.removeAllListeners('message');
        break
    
    case 'yesAgree':
      bot.sendMessage(chatId, `Согласие подписано. введите имя`);
      console.log ("count agree", count)
      // Обработчик введенных данных
      bot.on('message', async (msg) => {
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
          while (employee.phone.length < 10) { // цикл, который будет продолжаться, пока номер телефона не будет достаточной длины
            bot.sendMessage(chatId, 'Вы ввели слишком короткий номер. Повторите ввод');
            const response = await new Promise(resolve => bot.once('message', resolve)); // ждем ответа от пользователя и сохраняем его в переменную response
            if(response.text.length>9){
            employee.phone = response.text;} // сохраняем ответ пользователя в поле phone объекта employee
          }
          
          const flag = await readExcel(employee)
          console.log ("flag=", flag)
          if (flag)
          {
            bot.sendMessage(chatId, `Вы ввели: Имя: ${employee.firstName}, Фамилия: ${employee.lastName}, Отдел: ${employee.department}, Телефон: ${employee.phone} Такой сотрудник есть в списке. вы приглашаетесь в бот @username_bot.`)
            bot.sendMessage(adminChatId, `Пользователь ${msg.chat.first_name} ${msg.chat.last_name} id = ${msg.chat.id} нашел сотрудника с такими данными: Имя: ${employee.firstName}, Фамилия: ${employee.lastName}, Отдел: ${employee.department}, Телефон: ${employee.phone}`);
          // Удаляем все обработчики, кроме команды /start
            bot.removeAllListeners('message');
            //bot.removeAllListeners('callback_query');
          }
          else {
            bot.sendMessage(chatId, `Вы ввели: Имя: ${employee.firstName}, Фамилия: ${employee.lastName}, Отдел: ${employee.department}, Телефон: ${employee.phone} Такого сотрудника нет в списке. Для продолжения работы введите /start`)
            bot.sendMessage(adminChatId, `Пользователь ${msg.chat.first_name} ${msg.chat.last_name} не нашел сотрудника с такими данными: Имя: ${employee.firstName}, Фамилия: ${employee.lastName}, Отдел: ${employee.department}, Телефон: ${employee.phone}`);
              // Удаляем все обработчики, кроме команды /start
            bot.removeAllListeners('message');
            //bot.removeAllListeners('callback_query');
          };

          }

        })
        
    

    break;
                 
     
             case "noAgree":{
                bot.sendMessage(chatId, `К сожалению, без подписания Согласия мы не можем взаимодействовать. Для продолжения работы введите /start`)
                   break     
             }
  }
})
   
// bot.launch()
app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))