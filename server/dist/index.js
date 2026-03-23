"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cors_1 = __importDefault(require("cors"));
const wsServer_1 = require("./utils/wsServer");
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
//websocket
(0, wsServer_1.setupWebSocket)(server);
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use("/api/users", userRoutes_1.default);
app.use("/auth", authRoutes_1.default);
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Hello World!");
});
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
