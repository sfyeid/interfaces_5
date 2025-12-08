const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    match: [/^\S+@\S+\.\S+$/, 'Неверный формат email']
  },
  telephone: {
    mobile: {
      type: String,
      required: [true, 'Мобильный телефон обязателен'],
      match: [/^[\d\s\-\+\(\)]+$/, 'Неверный формат телефона']
    },
    home: {
      type: String,
      match: [/^[\d\s\-\+\(\)]+$/, 'Неверный формат телефона']
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);