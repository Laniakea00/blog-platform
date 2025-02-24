const { ObjectId } = require("mongodb");
const { client } = require("../config/db");
const WebSocket = require("ws");

const db = client.db("blog-platform");
const messagesCollection = db.collection("messages");

const activeChats = new Map(); // { userId: WebSocket }

function setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on("connection", (ws, req) => {
        const userId = new URL(req.url, `http://${req.headers.host}`).searchParams.get("userId");
        if (!userId) {
            ws.close();
            return;
        }

        activeChats.set(userId, ws);

        ws.on("message", async (data) => {
            const message = JSON.parse(data);
            const { senderId, receiverId, content } = message;

            if (!senderId || !receiverId || !content) return;

            const chatMessage = {
                chatId: generateChatId(senderId, receiverId), // Уникальный ID для каждого чата
                senderId,
                receiverId,
                content,
                timestamp: new Date(),
            };

            await messagesCollection.insertOne(chatMessage);

            if (activeChats.has(receiverId)) {
                activeChats.get(receiverId).send(JSON.stringify(chatMessage));
            }
        });

        ws.on("close", () => {
            activeChats.delete(userId);
        });
    });
}

// Генерация уникального Chat ID (например, "user1_admin")
function generateChatId(userId, adminId) {
    return userId < adminId ? `${userId}_${adminId}` : `${adminId}_${userId}`;
}

// Получение активных чатов
async function getActiveChats(req, res) {
    try {
        const activeUserIds = Array.from(activeChats.keys());
        res.json({ activeChats: activeUserIds });
    } catch (error) {
        res.status(500).json({ message: "Error fetching active chats", error });
    }
}

// Получение сообщений конкретного чата
async function getMessages(req, res) {
    const { userId, adminId } = req.params;
    try {
        const chatId = generateChatId(userId, adminId);
        const messages = await messagesCollection
            .find({ chatId })
            .sort({ timestamp: 1 })
            .toArray();

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error });
    }
}

// Удаление чата (удаляются все сообщения между userId и admin)
async function deleteChat(req, res) {
    const { userId, adminId } = req.params;

    try {
        const chatId = generateChatId(userId, adminId);
        await messagesCollection.deleteMany({ chatId });

        res.json({ message: "Chat deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting chat", error });
    }
}

module.exports = { setupWebSocket, getActiveChats, getMessages, deleteChat };
