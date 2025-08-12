console.log("Бот стартует");

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
if (!token) {
  console.error("TELEGRAM_TOKEN не найден в .env");
  process.exit(1);
}

// Создаем бота без polling, чтобы сначала сбросить обновления
const bot = new TelegramBot(token, { polling: false });

async function startBot() {
  try {
    // Удаляем webhook, если он установлен
    await bot.deleteWebhook();
    // Забираем все обновления, чтобы сбросить очередь
    await bot.getUpdates();
    // Запускаем polling
    bot.startPolling();
    console.log("Бот успешно запущен и слушает сообщения.");
  } catch (error) {
    console.error("Ошибка при запуске бота:", error);
    process.exit(1);
  }
}

bot.on('message', (msg) => {
  if (msg.text === '/ping') {
    bot.sendMessage(msg.chat.id, 'Pong!');
  }
});

startBot();
