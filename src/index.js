require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const adminId = process.env.ADMIN_ID;

if (!token || !adminId) {
  console.error("TELEGRAM_TOKEN или ADMIN_ID не найден в .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Временный объект для хранения, кто сейчас задает вопрос
const waitingForQuestion = {};

// Список запрещённых слов
const bannedWords = ["бля", "заныл", "хуй", "пиздец"]; // сюда добавляй свои бан-ворды

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Проверка на бан-ворды
  if (bannedWords.some(word => text.toLowerCase().includes(word))) {
    bot.sendMessage(chatId, "🚫 Пожалуйста, не используйте запрещённые слова!");
    return;
  }

  // Если пользователь в режиме написания вопроса
  if (waitingForQuestion[chatId]) {
    bot.sendMessage(adminId, `Вопрос от @${msg.from.username || msg.from.first_name}: ${text}`);
    bot.sendMessage(chatId, "Ваш вопрос отправлен!");
    delete waitingForQuestion[chatId]; // снимаем режим
    return;
  }

  switch (text) {
    case '/help':
      bot.sendMessage(chatId, "Напишите ваш вопрос:");
      waitingForQuestion[chatId] = true; // включаем режим вопроса
      break;

    case '/link':
      bot.sendMessage(chatId, "Сайт еще в разработке!");
      break;

    case '/me':
      bot.sendMessage(chatId, "Здесь будет информация о вас.");
      break;

    default:
      bot.sendMessage(chatId, "Неверно, попробуйте еще раз.");
      break;
  }
});

console.log("Бот запущен и слушает сообщения...");
