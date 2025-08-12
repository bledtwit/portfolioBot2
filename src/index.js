console.log("Бот стартует");

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error("TELEGRAM_TOKEN не найден в .env");
  process.exit(1);
}

// Создаем бота с настройкой для использования polling
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  if (msg.text === '/ping') {
    bot.sendMessage(msg.chat.id, 'Pong!');
  }
});

console.log("Бот успешно запущен и слушает сообщения.");
