require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const adminId = process.env.ADMIN_ID;
const appUrl = process.env.APP_URL || 'https://your-app.onrender.com';

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

// Webhook для Render
app.post('/bot', (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Регистрация команд для меню Telegram
bot.setMyCommands([
  { command: '/help', description: 'Помощь по боту' },
  { command: '/link', description: 'Ссылка на сайт' },
  { command: '/me', description: 'Информация о себе' }
]);

// Обработка сообщений
bot.on('message', (msg) => {
  const text = msg.text;

  // Если сообщение не команда
  if (!text.startsWith('/')) {
    bot.sendMessage(msg.chat.id, 'Неверная команда, попробуй ещё раз!');
    return;
  }

  switch(text) {
    case '/help':
      bot.sendMessage(msg.chat.id, 'Здесь будет помощь и инструкции по боту.');
      break;
    case '/link':
      bot.sendMessage(msg.chat.id, 'Сайт ещё в разработке.');
      break;
    case '/me':
      bot.sendMessage(msg.chat.id, 'Информация о тебе: ...');
      break;
    default:
      // Пересылка сообщений админу
      bot.sendMessage(adminId, `Новое сообщение от @${msg.from.username || msg.from.first_name}: ${text}`);
      bot.sendMessage(msg.chat.id, 'Команда не распознана. Попробуй ещё раз!');
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await bot.setWebHook(`${appUrl}/bot`);
  console.log(`Бот успешно запущен и слушает команды на ${appUrl}/bot`);
});
