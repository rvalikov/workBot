export function MakeKeyboard(){
    const keyboard = [
        [
          {
            text: 'Да', // текст на кнопке
            callback_data: 'yes' // данные для обработчика событий
          },
          { text: 'Нет', // текст на кнопке
    callback_data: 'no' }
        ],
        [
            {
              text: 'Горы',
              callback_data: 'Горы'
            },
            {
                text: 'Отель',
                callback_data: 'Отель'
              }
        ],
        [
            {
              text: 'EARTH',
              callback_data: 'Earth' 
            }
          ]
      ];
    return keyboard
}
export function KeyboardAgree(){
  const keyboardAgree = [
      [
        {
          text: 'Согласен', // текст на кнопке
          callback_data: 'yesAgree' // данные для обработчика событий
        },
        { text: 'Нет', // текст на кнопке
  callback_data: 'noAgree' }
      ]
  ]
  return keyboardAgree
    }