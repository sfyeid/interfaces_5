require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./src/config/db');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Подключение к БД
connectDB();

// Маршруты
app.use('/api/contacts', require('./src/routes/contacts'));

// Health check для Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Документация API
app.get('/api', (req, res) => {
  res.json({
    message: 'Phonebook API',
    endpoints: {
      getAll: 'GET /api/contacts',
      getOne: 'GET /api/contacts/:id',
      create: 'POST /api/contacts',
      update: 'PUT /api/contacts/:id',
      delete: 'DELETE /api/contacts/:id',
      deleteAll: 'DELETE /api/contacts'
    }
  });
});

// Корневой маршрут
app.get('/', (req, res) => {
  res.redirect('/api');
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📚 Документация API: http://localhost:${PORT}/api`);
});