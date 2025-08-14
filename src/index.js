require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const adminId = process.env.ADMIN_ID; // сюда твой Telegram ID, куда будут приходить сообщения от пользователей
if (!token) {
  console.error("TELEGRAM_TOKEN не найден в .env");
  process.exit(1);
}
if (!adminId) {
  console.error("ADMIN_ID не найден в .env");
  process.exit(1);
}

const bot = new TelegramBot(token);
const app = express();
app.use(express.json());

// Webhook URL, который Render выдаст, например: https://your-app.onrender.com/bot
app.post(`/bot`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Обработчик команд
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text.startsWith('/')) {
    // если это не команда, отправляем пользователю "неверная команда" и пересылаем сообщение админу
    bot.sendMessage(chatId, "Неверная команда, попробуйте ещё раз или используйте /help");
    bot.sendMessage(adminId, `Сообщение от ${msg.from.username || msg.from.first_name} (${chatId}): ${text}`);
    return;
  }

  switch (text) {
    case '/start':
      bot.sendMessage(chatId, "Привет! Я твой бот. Используй /help чтобы узнать мои команды.");
      break;
    case '/help':
      bot.sendMessage(chatId, "/link — ссылка на мой сайт\n/me — информация обо мне\n/help — показать список команд");
      break;
    case '/link':
      bot.sendMessage(chatId, "Сайт ещё в разработке 😅");
      break;
    case '/me':
      bot.sendMessage(chatId, "Информация обо мне: пока здесь пусто, скоро добавлю 😎");
      break;
    default:
      bot.sendMessage(chatId, "Команда не распознана, попробуйте ещё раз или используйте /help");
      break;
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  const url = process.env.APP_URL || `https://portfoliobot2.onrender.com`; // сюда вставь URL Render
  await bot.setWebHook(`${url}/bot`);
  console.log(`Бот успешно запущен и слушает сообщения на ${url}/bot`);
});
