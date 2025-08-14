// index.js
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Проверяем токен
const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error("Ошибка: TELEGRAM_TOKEN не найден в .env");
  process.exit(1);
}

// Создаём бота с polling (не нужен порт и Webhook)
const bot = new TelegramBot(token, { polling: true });

console.log("Бот успешно запущен через polling и работает непрерывно.");

// Пример обработчиков сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  // Команда /ping
  if (text === '/ping') {
    bot.sendMessage(chatId, 'Pong!');
  }

  // Пример простого ответа
  if (text.toLowerCase() === 'привет') {
    bot.sendMessage(chatId, 'Привет! Я бот.');
  }

  // Добавляй свои обработчики сюда
});

// Обработка ошибок
bot.on('polling_error', (err) => {
  console.error('Polling ошибка:', err.code, err.message);
});
