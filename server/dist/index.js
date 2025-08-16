"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes/routes"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Request logging middleware
app.use((req, res, next) => {
    console.log(`📝 [${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log(`📝 Headers:`, req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log(`📝 Body:`, {
            ...req.body,
            text: req.body.text ? `${req.body.text.substring(0, 100)}...` : undefined
        });
    }
    next();
});
// Health check endpoint
app.get("/health", (req, res) => {
    console.log(`💓 [HEALTH] Health check requested`);
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        message: "Server is running"
    });
});
// Routes
app.use("/api/summary", routes_1.default);
// Catch-all route for debugging unmatched requests
app.use("*", (req, res) => {
    console.log(`❓ [404] Unmatched route: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: "Route not found",
        method: req.method,
        path: req.originalUrl
    });
});
// Connect DB & Start Server
(0, db_1.default)().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
//# sourceMappingURL=index.js.map