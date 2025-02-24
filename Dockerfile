# Используем Node.js образ
FROM node:18

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код проекта
COPY . .

# Открываем порт
EXPOSE 3000

# Запускаем сервер
CMD ["npm", "start"]
