"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Controller_1 = require("../controllers/Controller");
const router = express_1.default.Router();
router.post("/upload", Controller_1.uploadSummary);
router.get("/", Controller_1.getSummaries);
router.post("/share", Controller_1.shareSummary);
router.put("/update", Controller_1.updateSummary);
router.delete("/delete/:summaryId", Controller_1.deleteSummary);
exports.default = router;
//# sourceMappingURL=routes.js.map