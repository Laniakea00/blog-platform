const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const { connectDB } = require('./config/db');
const cors = require('cors');

require('dotenv').config();
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

const http = require("http");
const { setupWebSocket } = require("./controllers/chatController");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Connect to MongoDB
connectDB();


// Middleware
app.use(express.json());
app.use(cors());

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend')))
let clients = {}; // { chatID: ws }
let admins = new Set();
let chatHistory = {}; // { chatID: [{ sender, content }] }

wss.on("connection", (ws, req) => {
    const params = new URL(req.url, `http://${req.headers.host}`).searchParams;
    const chatID = params.get("chat_id");
    const isAdmin = params.get("admin") === "true";

    if (isAdmin) {
        admins.add(ws);
    } else if (chatID) {
        clients[chatID] = ws;
        if (chatHistory[chatID]) {
            chatHistory[chatID].forEach(msg => ws.send(JSON.stringify(msg)));
        }
    } else {
        ws.close();
        return;
    }

    ws.on("message", (message) => {
        const msg = JSON.parse(message);
        if (!msg.chat_id || !msg.content) return;

        if (!chatHistory[msg.chat_id]) {
            chatHistory[msg.chat_id] = [];
        }
        chatHistory[msg.chat_id].push(msg);

        admins.forEach(admin => admin.send(JSON.stringify(msg)));
        if (clients[msg.chat_id]) {
            clients[msg.chat_id].send(JSON.stringify(msg));
        }
    });

    ws.on("close", () => {
        if (isAdmin) {
            admins.delete(ws);
        } else {
            delete clients[chatID];
        }
    });
});

app.get("/chats", (req, res) => {
    res.json(Object.keys(chatHistory).map(chatID => ({
        chat_id: chatID,
        messages: chatHistory[chatID] || []
    })));
});

app.delete("/delete_chat", (req, res) => {
    const chatID = req.query.chat_id;
    if (chatID && chatHistory[chatID]) {
        delete chatHistory[chatID];
        if (clients[chatID]) {
            clients[chatID].close();
            delete clients[chatID];
        }
        res.status(200).send("Chat deleted");
    } else {
        res.status(404).send("Chat not found");
    }
});

// Статические страницы
app.get("/chat", (req, res) => res.sendFile(__dirname + "/frontend/chat.html"));
app.get("/adminChat", (req, res) => res.sendFile(__dirname + "/frontend/adminChat.html"));

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/posts', require('./routes/postRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use("/admin", require('./routes/adminRoutes'));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});
// 404 Middleware - Handles undefined routes
app.use(notFoundHandler);

// Global Error Handling Middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
