require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = process.env.TELEGRAM_TOKEN;
const adminId = process.env.ADMIN_ID;
const appUrl = process.env.APP_URL; // твой Render URL

if (!token || !adminId || !appUrl) {
  console.error("TELEGRAM_TOKEN, ADMIN_ID или APP_URL не найден в .env");
  process.exit(1);
}

// === Telegram Bot в режиме webhook ===
const bot = new TelegramBot(token, { webHook: true });
bot.setWebHook(`${appUrl}/bot${token}`);

// === Express сервер для Render ===
const app = express();
app.use(express.json());

// Принимаем апдейты от Telegram
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Проверка, что сервер жив
app.get('/', (req, res) => {
  res.send('Bot is running!');
});

// === Логика бота ===
const waitingForQuestion = {};
const bannedWords = ["бля", "заныл", "хуй", "пиздец"];

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text || "";

  // Проверка на бан-ворды
  if (bannedWords.some(word => text.toLowerCase().includes(word))) {
    bot.sendMessage(chatId, "🚫 Пожалуйста, не используйте запрещённые слова!");
    return;
  }

  // Если пользователь в режиме написания вопроса
  if (waitingForQuestion[chatId]) {
    bot.sendMessage(adminId, `Вопрос от @${msg.from.username || msg.from.first_name}: ${text}`);
    bot.sendMessage(chatId, "Ваш вопрос отправлен!");
    delete waitingForQuestion[chatId];
    return;
  }

  switch (text) {
    case '/help':
      bot.sendMessage(chatId, "Напишите ваш вопрос:");
      waitingForQuestion[chatId] = true;
      break;

    case '/link':
      bot.sendMessage(chatId, "Сайт еще в разработке!");
      break;

    case '/me':
      bot.sendMessage(chatId, "Я личный бот -- nineteenmg");
      break;

    default:
      bot.sendMessage(chatId, "Неверно, попробуйте еще раз.");
      break;
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
