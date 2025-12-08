const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Хранилище в памяти (вместо MongoDB)
let contacts = [
  {
    _id: "1",
    username: "Иван Иванов",
    email: "ivan@example.com",
    telephone: {
      mobile: "+79991234567",
      home: "+74951234567"
    },
    createdAt: new Date()
  },
  {
    _id: "2", 
    username: "Мария Петрова",
    email: "maria@example.com",
    telephone: {
      mobile: "+79997654321",
      home: "+74957654321"
    },
    createdAt: new Date()
  },
  {
    _id: "3",
    username: "Алексей Смирнов",
    email: "alex@example.com",
    telephone: {
      mobile: "+79998887766",
      home: ""
    },
    createdAt: new Date()
  }
];

let nextId = 4;

// ====================== REST API ENDPOINTS ======================

// 1. GET /api/contacts - Получить все контакты
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

// 2. GET /api/contacts/:id - Получить контакт по ID
app.get('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(c => c._id === req.params.id);
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ error: 'Контакт не найден' });
  }
});

// 3. POST /api/contacts - Создать новый контакт
app.post('/api/contacts', (req, res) => {
  const { username, email, telephone } = req.body;
  
  // Валидация
  if (!username || !email || !telephone?.mobile) {
    return res.status(400).json({ 
      error: 'Обязательные поля: username, email, telephone.mobile' 
    });
  }
  
  const newContact = {
    _id: nextId.toString(),
    username,
    email,
    telephone: {
      mobile: telephone.mobile,
      home: telephone.home || ''
    },
    createdAt: new Date()
  };
  
  contacts.push(newContact);
  nextId++;
  
  res.status(201).json(newContact);
});

// 4. PUT /api/contacts/:id - Обновить контакт
app.put('/api/contacts/:id', (req, res) => {
  const { username, email, telephone } = req.body;
  const index = contacts.findIndex(c => c._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Контакт не найден' });
  }
  
  contacts[index] = {
    ...contacts[index],
    username: username || contacts[index].username,
    email: email || contacts[index].email,
    telephone: {
      mobile: telephone?.mobile || contacts[index].telephone.mobile,
      home: telephone?.home || contacts[index].telephone.home
    }
  };
  
  res.json(contacts[index]);
});

// 5. DELETE /api/contacts/:id - Удалить контакт
app.delete('/api/contacts/:id', (req, res) => {
  const initialLength = contacts.length;
  contacts = contacts.filter(c => c._id !== req.params.id);
  
  if (contacts.length < initialLength) {
    res.json({ 
      success: true, 
      message: 'Контакт удален',
      id: req.params.id 
    });
  } else {
    res.status(404).json({ error: 'Контакт не найден' });
  }
});

// 6. DELETE /api/contacts - Удалить все контакты
app.delete('/api/contacts', (req, res) => {
  const count = contacts.length;
  contacts = [];
  nextId = 1;
  
  res.json({ 
    success: true, 
    message: `Удалено ${count} контактов`,
    contacts: []
  });
});

// ====================== ДОПОЛНИТЕЛЬНЫЕ МАРШРУТЫ ======================

// Health check для Render
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    contactsCount: contacts.length,
    memory: process.memoryUsage()
  });
});

// Документация API
app.get('/api', (req, res) => {
  res.json({
    message: '📒 Phonebook REST API (In-memory version)',
    version: '1.0.0',
    description: 'CRUD API для управления телефонным справочником',
    endpoints: {
      'GET /api/contacts': 'Получить все контакты',
      'GET /api/contacts/:id': 'Получить контакт по ID',
      'POST /api/contacts': 'Создать новый контакт',
      'PUT /api/contacts/:id': 'Обновить контакт',
      'DELETE /api/contacts/:id': 'Удалить контакт',
      'DELETE /api/contacts': 'Удалить все контакты'
    },
    exampleRequest: {
      create: {
        method: 'POST',
        url: '/api/contacts',
        body: {
          username: 'Имя Фамилия',
          email: 'email@example.com',
          telephone: {
            mobile: '+79991234567',
            home: '+74951234567'
          }
        }
      }
    }
  });
});

// Корневой маршрут - перенаправление на документацию
app.get('/', (req, res) => {
  res.redirect('/api');
});

// 404 обработчик
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Маршрут не найден',
    availableRoutes: ['/api', '/api/contacts', '/health']
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Сервер успешно запущен!`);
  console.log(`📍 Порт: ${PORT}`);
  console.log(`📊 Контактов в памяти: ${contacts.length}`);
  console.log(`🌐 API доступен по адресам:`);
  console.log(`   - Локально: http://localhost:${PORT}`);
  console.log(`   - Документация: http://localhost:${PORT}/api`);
  console.log(`   - Health check: http://localhost:${PORT}/health`);
  console.log('='.repeat(50));
  console.log('✅ Готов к работе! Отправляй запросы!');
});