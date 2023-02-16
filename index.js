import express  from 'express'
// import ExcelJS from 'exceljs'
import { PORT, TOKEN } from './config.js'
import TelegramBot from 'node-telegram-bot-api'; // подключаем node-telegram-bot-api
import { KeyboardAgree, MakeKeyboard } from './keyboard.js';
import fs from "fs"
import  { readExcel}  from './telegram-excel-bot.js';

const bot = new TelegramBot(TOKEN, {polling:true});
const app = express()
const keyboard=MakeKeyboard()
const keyboardAgree=KeyboardAgree()


// GREETING BLOCK
bot.onText(/\/start/, msg => {
    const chatId = msg.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
    console.log(chatId)
  const chatName= msg.chat.first_name
    // отправляем сообщение
    bot.sendMessage(chatId, `Привет ${chatName}!  Познакомимся? `,
    // include keyboard
    {
        reply_markup: {
            inline_keyboard: keyboard
        }
    }
    )
    })
   //Обработчик нажатия клавиатуры
    bot.on('callback_query', (query) => {
        const chatId = query.message.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
     
        // отправляем сообщение
        switch(query.data){
            case "yes":{ bot.sendMessage(chatId, `Загрузка согласия`)
            fs.readFile("./Согласие по ФЗ-152.pdf",(err,file)=>{
                bot.sendDocument(chatId, file,
                    {
                        caption:"Согласие"
                    })
                .then(()=>{bot.sendMessage(chatId, `Подпиши согласие`,
                 // include keyboard
            {
                reply_markup: {
                    inline_keyboard: keyboardAgree
                }
            } )
            })
        })
            
            break;
             }
             case "yesAgree":{
                        
                bot.sendMessage(chatId, `Согласие подписано. Введите Ваше Имя Фамилию Отдел Телефон через пробел`)
                bot.on("message", async (msg) => {
                    const lastName = msg.chat.last_name
                    const chatId = msg.chat.id;
                    const text = msg.text;
                    const textlist = text.split(" ");
                  
                    bot.sendMessage(chatId, `Ваши данные ${textlist}`);
                  
                    const flag = await readExcel(textlist);
                  
                    if (flag) {
                        const AdminId= 590783190
                        bot.sendMessage(AdminId, `Пользователь  найден в таблице Excel!`)
                        
                        
                    } else {const AdminId= 590783190
                        bot.sendMessage(AdminId,'Пользователь не найден в таблице Excel.')
                    }
                  });
                  break;  
          }
                 
             
             case "noAgree":{
                bot.sendMessage(chatId, `К сожалению, без подписания Согласия мы не можем взаимодействовать`)
                   break     
             }
            }
    })
// bot.launch()
app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))