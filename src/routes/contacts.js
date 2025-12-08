const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET /api/contacts - Получить все контакты
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// GET /api/contacts/:id - Получить контакт по ID
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Контакт не найден' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// POST /api/contacts - Создать новый контакт
router.post('/', async (req, res) => {
  try {
    const { username, email, telephone } = req.body;
    
    // Валидация
    if (!username || !email || !telephone?.mobile) {
      return res.status(400).json({ error: 'Заполните все обязательные поля' });
    }

    const contact = new Contact({
      username,
      email,
      telephone: {
        mobile: telephone.mobile,
        home: telephone.home || ''
      }
    });

    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// PUT /api/contacts/:id - Обновить контакт
router.put('/:id', async (req, res) => {
  try {
    const { username, email, telephone } = req.body;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      {
        username,
        email,
        telephone: {
          mobile: telephone.mobile,
          home: telephone.home || ''
        }
      },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({ error: 'Контакт не найден' });
    }

    res.json(contact);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /api/contacts/:id - Удалить контакт
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ error: 'Контакт не найден' });
    }
    res.json({ message: 'Контакт удален', id: contact._id });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// DELETE /api/contacts - Удалить все контакты
router.delete('/', async (req, res) => {
  try {
    await Contact.deleteMany({});
    res.json({ message: 'Все контакты удалены' });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;