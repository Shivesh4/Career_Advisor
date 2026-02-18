import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { z } from "zod";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  getProfile,
  upsertProfile,
  uploadResume,
} from "../controllers/profileController.js";

const router = express.Router();

//  Use top-level "uploads" folder (not src/uploads)
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({ storage });

// Zod schema for profile validation
const profileSchema = {
  body: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    title: z.string().optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    skills: z.array(z.string()).optional(),
    aiCourses: z.array(z.any()).optional(),
    aiArticles: z.array(z.any()).optional(),
    aiAdvice: z.array(z.string()).optional(),
  }),
};

// Routes
router.get("/", verifyToken, getProfile);
router.post("/", verifyToken, validate(profileSchema), upsertProfile);

// Resume upload (single)
router.post("/resume", verifyToken, upload.single("resume"), uploadResume);

export default router;
