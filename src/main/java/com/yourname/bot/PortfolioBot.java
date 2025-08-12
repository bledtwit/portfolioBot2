package com.yourname.bot;

import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.CallbackQuery;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.ArrayList;
import java.util.List;

public class PortfolioBot extends TelegramLongPollingBot {

    @Override
    public String getBotUsername() {
        return "@nineteenmg"; // Имя вашего бота
    }

    @Override
    public String getBotToken() {
        return System.getenv("BOT_TOKEN"); // Ваш токен
    }

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage() && update.getMessage().hasText()) {
            String messageText = update.getMessage().getText();
            long chatId = update.getMessage().getChatId();

            if (messageText.equals("/start")) {
                SendMessage message = new SendMessage();
                message.setChatId(String.valueOf(chatId));
                message.setText("Привет! Выбери вопрос из меню:");

                InlineKeyboardMarkup markupInline = new InlineKeyboardMarkup();
                List<List<InlineKeyboardButton>> rowsInline = new ArrayList<>();

                // Первая строка кнопок
                List<InlineKeyboardButton> rowInline1 = new ArrayList<>();

                InlineKeyboardButton button1 = new InlineKeyboardButton();
                button1.setText("Технологии");
                button1.setCallbackData("tech");
                rowInline1.add(button1);

                InlineKeyboardButton button2 = new InlineKeyboardButton();
                button2.setText("Проекты");
                button2.setCallbackData("projects");
                rowInline1.add(button2);

                // Вторая строка кнопок
                List<InlineKeyboardButton> rowInline2 = new ArrayList<>();
                InlineKeyboardButton button3 = new InlineKeyboardButton();
                button3.setText("Контакты и сайт");
                button3.setCallbackData("contacts");
                rowInline2.add(button3);

                rowsInline.add(rowInline1);
                rowsInline.add(rowInline2);

                markupInline.setKeyboard(rowsInline);
                message.setReplyMarkup(markupInline);

                try {
                    execute(message);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
            }
        } else if (update.hasCallbackQuery()) {
            CallbackQuery callbackQuery = update.getCallbackQuery();
            String data = callbackQuery.getData();
            long chatId = callbackQuery.getMessage().getChatId();

            SendMessage message = new SendMessage();
            message.setChatId(String.valueOf(chatId));

            switch (data) {
                case "tech":
                    message.setText("Я работаю с Java, Spring Boot, PostgreSQL, Docker и другими технологиями.");
                    break;
                case "projects":
                    message.setText("Вот мои проекты:\n- Проект 1: ...\n- Проект 2: ...");
                    break;
                case "contacts":
                    message.setText("Связаться со мной можно здесь:\nhttps://твoйсайт.ру");
                    break;
                default:
                    message.setText("Выберите пункт меню.");
            }

            try {
                execute(message);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        }
    }
}
