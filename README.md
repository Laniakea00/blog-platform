# Blog Platform

Blog Platform — это веб-приложение для ведения блога с административной панелью и чатом между пользователями и администраторами.  
Проект включает в себя **Node.js (Express)** для backend'а и **MongoDB** для хранения данных.  
Развёртывание осуществляется с помощью **Docker и Docker Compose**.

---

## 🚀 Функционал проекта

- **Регистрация и авторизация пользователей**
- **Роль админа** с возможностью управления пользователями и постами**
- **Админ-панель** для просмотра пользователей и удаления постов
- **Чат между пользователями и администраторами** (WebSocket)
- **Деплой с использованием Docker и Docker Compose**

---

## 📂 Структура проекта

blog-platform/ │── config/ # Конфигурационные файлы │── controllers/ # Контроллеры для обработки запросов │── frontend/ # Фронтенд-страницы (HTML, CSS, JS) │── middleware/ # Middleware-функции (аутентификация, логирование) │── models/ # Модели базы данных (MongoDB) │── routes/ # API маршруты │── .env # Переменные окружения │── Dockerfile # Docker-образ │── docker-compose.yml # Конфигурация Docker Compose │── package.json # Список зависимостей проекта │── server.js # Основной серверный файл


---

## ⚙️ Установка и запуск

### **1. Клонируйте репозиторий**
git clone https://github.com/your-username/blog-platform.git
cd blog-platform
2. Заполните .env файл
Создайте .env в корневой папке и укажите переменные:

init -y
MONGO_URI=mongodb://root:example@mongodb:27017/blog-platform?authSource=admin
JWT_SECRET=your_jwt_secret
Если вы используете MongoDB Atlas, укажите свой MONGO_URI: 
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-platform?retryWrites=true&w=majority

🐳 Развёртывание с Docker
1. Соберите и запустите контейнеры
docker-compose up --build
2. Остановите контейнеры
docker-compose down
3. Запуск в фоне (режим detached)
docker-compose up -d

🔥 Использование API
1. Регистрация пользователя
POST /api/auth/register
Body (JSON):
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "securepassword"
}
2. Авторизация пользователя
POST /api/auth/login
Body (JSON):
{
  "email": "test@example.com",
  "password": "securepassword"
}
3. Получение списка пользователей (только для админов)+
GET /api/admin/users
Headers:
Authorization: Bearer YOUR_ACCESS_TOKEN
📜 Лицензия
Этот проект распространяется под лицензией MIT.

🛠 Технологии
Node.js + Express
MongoDB
WebSocket (для чата)
Docker и Docker Compose
JWT для аутентификации
Admin Panel (Frontend на HTML, CSS, JS)
