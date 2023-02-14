import express  from 'express'
import { PORT, TOKEN } from './config.js'
import TelegramBot from 'node-telegram-bot-api'; // подключаем node-telegram-bot-api
import { KeyboardAgree, MakeKeyboard } from './keyboard.js';
import fs from "fs"
const bot = new TelegramBot(TOKEN, {polling:true});
const app = express()
const keyboard=MakeKeyboard()
const keyboardAgree=KeyboardAgree()

// GREETING BLOCK
bot.on('message', (msg) => {
    const chatId = msg.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
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
      console.log("query: " + query)
        // отправляем сообщение
        switch(query.data){
            case "yes":{ bot.sendMessage(chatId, `Загрузка согласия`)
            fs.readFile("./Agree.pdf",(err,file)=>{
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
                        
                bot.sendMessage(chatId, `Согласие подписано Введите телефон`)
                
             }
            }
            })
// bot.launch()
app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))