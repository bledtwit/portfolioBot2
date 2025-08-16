require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const { OpenAI } = require('openai'); // Новый импорт для OpenAI API

const token = process.env.TELEGRAM_TOKEN;
const adminId = process.env.ADMIN_ID;
const appUrl = process.env.APP_URL;
const openaiKey = process.env.OPENAI_API_KEY;

if (!token || !adminId || !appUrl || !openaiKey) {
  console.error("Не хватает переменных в .env (TELEGRAM_TOKEN, ADMIN_ID, APP_URL, OPENAI_API_KEY)");
  process.exit(1);
}

// Настройка OpenAI
const openai = new OpenAI({
  apiKey: openaiKey,
});

// Telegram Bot в режиме webhook
const bot = new TelegramBot(token, { webHook: true });
bot.setWebHook(`${appUrl}/bot${token}`);

// Express сервер для Render
const app = express();
app.use(express.json());
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});
app.get('/', (req, res) => res.send('Bot is running!'));

// Логика бота
const waitingForQuestion = {};
const waitingForChat = {};   // 🔥 нужно было добавить
const bannedWords = ["бля", "заныл", "хуй", "пиздец"];

bot.on('message', async (msg) => {   // 🔥 теперь async
  const chatId = msg.chat.id;
  const text = msg.text || "";

  // Проверка на бан-ворды
  if (bannedWords.some(word => text.toLowerCase().includes(word))) {
    bot.sendMessage(chatId, "🚫 Пожалуйста, не используйте запрещённые слова!");
    return;
  }

  // Если пользователь в режиме вопроса
  if (waitingForQuestion[chatId]) {
    bot.sendMessage(adminId, `Вопрос от @${msg.from.username || msg.from.first_name}: ${text}`);
    bot.sendMessage(chatId, "Ваш вопрос отправлен!");
    delete waitingForQuestion[chatId];
    return;
  }

  // 🔥 Если пользователь в режиме чата с ИИ
  if (waitingForChat[chatId]) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: text }],
      });
      const answer = response.choices[0].message.content;
      bot.sendMessage(chatId, answer);
    } catch (error) {
      bot.sendMessage(chatId, "Произошла ошибка при общении с ИИ.");
      console.error(error);
    }
    return;
  }

  // Команды
  switch (text) {
    case '/help':
      bot.sendMessage(chatId, "Напишите ваш вопрос:");
      waitingForQuestion[chatId] = true;
      break;

    case '/link':
      bot.sendMessage(chatId, "🌐 Мое портфолио: https://bledtwit.github.io/");
      break;

    case '/me':
      bot.sendMessage(chatId, "Привет! Я Кирилл Рыхликов, Java Backend разработчик...");
      break;

    case '/chat':
      bot.sendMessage(chatId, "Вы вошли в режим чата с ИИ. Для выхода отправьте /exit.");
      waitingForChat[chatId] = true;
      break;

    case '/exit':
      bot.sendMessage(chatId, "Вы вышли из режима чата с ИИ.");
      delete waitingForChat[chatId];
      break;

    default:
      bot.sendMessage(chatId, "Неверно, попробуйте еще раз. Напишите /help для помощи.");
      break;
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
