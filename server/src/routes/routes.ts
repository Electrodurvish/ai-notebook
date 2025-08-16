import express from "express";
import { uploadSummary, getSummaries, shareSummary, updateSummary, deleteSummary } from "../controllers/Controller";

const router = express.Router();

router.post("/upload", uploadSummary);
router.get("/", getSummaries);
router.post("/share", shareSummary);
router.put("/update", updateSummary);
router.delete("/delete/:summaryId", deleteSummary);

export default router;
