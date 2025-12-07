// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB подключена"))
  .catch(err => console.error("❌ Ошибка MongoDB:", err));

// Схема и модель
const contactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String
});

const Contact = mongoose.model("Contact", contactSchema);

// === ROUTES ===

// Получить все контакты
app.get("/api/contacts", async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

// Получить 1 контакт
app.get("/api/contacts/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Контакт не найден" });
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: "Некорректный ID" });
  }
});

// Добавить новый контакт
app.post("/api/contacts", async (req, res) => {
  const newContact = new Contact(req.body);
  await newContact.save();
  res.status(201).json(newContact);
});

// Обновить контакт
app.put("/api/contacts/:id", async (req, res) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Контакт не найден" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Ошибка при обновлении" });
  }
});

// Удалить контакт
app.delete("/api/contacts/:id", async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Контакт не найден" });
    res.json({ message: "Контакт удалён" });
  } catch (err) {
    res.status(400).json({ error: "Ошибка при удалении" });
  }
});

// Запуск сервера
app.listen(PORT, () => console.log(`🌍 Сервер запущен на порту ${PORT}`));

// curl http://localhost:5000/api/contacts

// curl -X POST http://localhost:5000/api/contacts -H "Content-Type: application/json" 

//"C:\Program Files\Heroku\bin\heroku.cmd" login
