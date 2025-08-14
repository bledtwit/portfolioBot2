# Используем Node.js
FROM node:20

# Создаем рабочую папку в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Порт, который будет открыт в контейнере (если нужно)
EXPOSE 3000

# Команда для запуска бота
CMD ["node", "src/index.js"]
